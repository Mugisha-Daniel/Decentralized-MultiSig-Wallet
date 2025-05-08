import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import MultiSigWallet from '../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [owners, setOwners] = useState([]);
  const [balance, setBalance] = useState('0');
  const [transactions, setTransactions] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const updateTransactions = async () => {
    if (contract) {
      try {
        const count = await contract.transactionCount();
        const txs = [];

        for (let i = 0; i < count; i++) {
          const tx = await contract.transactions(i);
          const confirmations = await contract.numConfirmations(i);
          const value = ethers.utils.formatEther(tx.value);

          txs.push({
            id: i,
            to: tx.to,
            value: parseFloat(value).toFixed(4),
            executed: tx.executed,
            numConfirmations: confirmations.toString(),
            data: tx.data,
          });
        }

        setTransactions(txs.reverse());
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 31337) {
        throw new Error("Please connect to Hardhat Network (localhost:8545)");
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const signer = provider.getSigner();

      if (!ethers.utils.isAddress(contractAddress)) {
        throw new Error("Invalid contract address");
      }

      const contract = new ethers.Contract(
        contractAddress,
        MultiSigWallet.abi,
        signer
      );

      await contract.getOwners();

      setAccount(accounts[0]);
      setProvider(provider);
      setContract(contract);

      const ownersList = await contract.getOwners();
      setOwners(ownersList);

      const balance = await provider.getBalance(contractAddress);
      setBalance(ethers.utils.formatEther(balance));

      await updateTransactions();

    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const isOwner = (address) => {
    if (!address || !owners) return false;
    return owners.map(owner => owner.toLowerCase()).includes(address.toLowerCase());
  };

  const submitTransaction = async (to, amount) => {
    try {
      if (!contract || !account) return;

      if (!isOwner(account)) {
        throw new Error("Only owners can submit transactions");
      }

      if (parseFloat(amount) <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const contractBalance = await provider.getBalance(contract.address);
      if (ethers.utils.parseEther(amount).gt(contractBalance)) {
        throw new Error("Insufficient contract balance");
      }

      const tx = await contract.submitTransaction(
        to,
        ethers.utils.parseEther(amount.toString()),
        "0x",
        { gasLimit: 1000000 }
      );

      await tx.wait();
      await updateTransactions();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      throw error;
    }
  };

  const confirmTransaction = async (txId) => {
    try {
      if (!contract || !account) return;

      if (!isOwner(account)) {
        throw new Error("Only owners can confirm transactions");
      }

      const hasConfirmed = await contract.isConfirmed(txId, account);
      if (hasConfirmed) {
        throw new Error("Transaction already confirmed by this owner");
      }

      const tx = await contract.confirmTransaction(txId, { gasLimit: 1000000 });
      await tx.wait();
      await updateTransactions();
    } catch (error) {
      console.error('Error confirming transaction:', error);
      throw error;
    }
  };

  const executeTransaction = async (txId) => {
    try {
      if (!contract) return;

      const confirmations = await contract.numConfirmations(txId);
      if (confirmations < 2) {
        throw new Error("Not enough confirmations");
      }

      const transaction = await contract.transactions(txId);
      if (transaction.executed) {
        throw new Error("Transaction already executed");
      }

      const tx = await contract.executeTransaction(txId, { gasLimit: 1000000 });
      await tx.wait();
      await updateTransactions();
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  };

  const depositETH = async (amount) => {
    try {
      if (!contract || !account) return;

      const tx = await provider.getSigner().sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther(amount.toString()),
        gasLimit: 1000000
      });

      await tx.wait();

      const newBalance = await provider.getBalance(contract.address);
      setBalance(ethers.utils.formatEther(newBalance));
    } catch (error) {
      console.error('Error depositing ETH:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        contract,
        provider,
        owners,
        balance,
        transactions,
        connectWallet,
        updateTransactions,
        submitTransaction,
        confirmTransaction,
        executeTransaction,
        isOwner,
        depositETH
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
