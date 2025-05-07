import React, { useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

function TransactionList() {
  const { transactions, contract, provider, updateTransactions } = useWeb3();

  useEffect(() => {
    if (contract && provider) {
      updateTransactions();

      // Listen for new transaction submissions
      contract.on('SubmitTransaction', () => {
        updateTransactions();
      });

      return () => {
        contract.removeAllListeners('SubmitTransaction');
      };
    }
  }, [contract, provider]);

  return (
    <Box w="full" maxW="container.md" p={6} bg="white" rounded="lg" shadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={4}>Transactions ({transactions.length})</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>To</Th>
            <Th>Value (ETH)</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((tx) => (
            <Tr key={tx.id}>
              <Td>{tx.id}</Td>
              <Td>{tx.to.slice(0, 6)}...{tx.to.slice(-4)}</Td>
              <Td>{ethers.utils.formatEther(tx.value)}</Td>
              <Td>{tx.executed ? 'Executed' : `${tx.numConfirmations} confirmations`}</Td>
            </Tr>
          ))}
          {transactions.length === 0 && (
            <Tr>
              <Td colSpan={4} textAlign="center">No transactions yet</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}

export default TransactionList;