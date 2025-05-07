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

  const updateBalance = async () => {
    if (contract && provider) {
      const balance = await provider.getBalance(contract.address);
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        // Configure the provider with the network
        const provider = new ethers.providers.Web3Provider(window.ethereum, {
          name: 'localhost',
          chainId: 1337
        });
        
        await provider.ready; // Wait for provider to be ready
        const signer = provider.getSigner();
        
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
        const contract = new ethers.Contract(
          contractAddress,
          MultiSigWallet.abi,
          signer
        );

        setAccount(accounts[0]);
        setProvider(provider);
        setContract(contract);

        // Get wallet info
        const ownersList = await contract.getOwners();
        setOwners(ownersList);
        await updateBalance();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Listen for balance changes
  useEffect(() => {
    if (provider && contract) {
      provider.on('block', updateBalance);
      return () => {
        provider.removeListener('block', updateBalance);
      };
    }
  }, [provider, contract]);

  const sendEth = async (value) => {
    try {
      if (!provider || !contract) throw new Error("Wallet not connected");
      
      const signer = provider.getSigner();
      // First send ETH to contract
      const tx = await signer.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther(value.toString())
      });
      await tx.wait();

      // Then submit it as a transaction to the wallet
      const submitTx = await contract.submitTransaction(
        contract.address,
        ethers.utils.parseEther(value.toString()),
        "0x"
      );
      await submitTx.wait();
      
      await updateBalance();
      await updateTransactions();
      return true;
    } catch (error) {
      console.error("Error sending ETH:", error);
      throw error;
    }
  };

  const updateTransactions = async () => {
    if (contract && provider) {
      try {
        // Use the public variable instead of getter method
        const count = await contract.transactionCount();
        
        const txs = [];
        for (let i = 0; i < count; i++) {
          try {
            // Use the public mapping
            const tx = await contract.transactions(i);
            const confirmations = await contract.numConfirmations(i);
            
            txs.push({
              id: i,
              to: tx.to,
              value: tx.value,
              executed: tx.executed,
              numConfirmations: confirmations.toString()
            });
          } catch (txError) {
            console.error(`Failed to fetch transaction ${i}:`, txError);
          }
        }
        
        setTransactions(txs);
      } catch (error) {
        console.error("Error in updateTransactions:", error.message);
      }
    }
  };

  // Single event listener for all transaction events
  useEffect(() => {
    if (contract) {
      const events = ["SubmitTransaction", "ConfirmTransaction", "ExecuteTransaction", "RevokeConfirmation"];
      
      events.forEach(event => {
        contract.on(event, updateTransactions);
      });

      // Initial fetch
      updateTransactions();

      return () => {
        events.forEach(event => {
          contract.removeListener(event, updateTransactions);
        });
      };
    }
  }, [contract]);

  // Update transactions more frequently
  useEffect(() => {
    if (contract) {
      const interval = setInterval(updateTransactions, 2000); // Poll every 2 seconds
      return () => clearInterval(interval);
    }
  }, [contract]);

  // Also update on specific events
  useEffect(() => {
    if (contract) {
      contract.on("SubmitTransaction", (sender, txIndex, to, value, data) => {
        console.log("New transaction submitted:", txIndex.toString());
        updateTransactions();
      });

      contract.on("ConfirmTransaction", (sender, txIndex) => {
        console.log("Transaction confirmed:", txIndex.toString());
        updateTransactions();
      });

      return () => {
        contract.removeAllListeners();
      };
    }
  }, [contract]);

  // Listen for contract events
  useEffect(() => {
    if (contract) {
      const filters = [
        contract.filters.SubmitTransaction(),
        contract.filters.ConfirmTransaction(),
        contract.filters.ExecuteTransaction(),
        contract.filters.RevokeConfirmation()
      ];

      filters.forEach(filter => {
        contract.on(filter, updateTransactions);
      });

      return () => {
        filters.forEach(filter => {
          contract.off(filter, updateTransactions);
        });
      };
    }
  }, [contract]);

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
        sendEth,
        updateTransactions, // Add this
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}