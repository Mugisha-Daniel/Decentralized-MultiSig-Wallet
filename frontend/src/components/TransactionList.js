import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Text
} from '@chakra-ui/react';

function TransactionList() {
  const { transactions, contract, account } = useWeb3();

  const handleConfirm = async (txId) => {
    try {
      await contract.confirmTransaction(txId);
    } catch (error) {
      console.error('Error confirming transaction:', error);
    }
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" mb={4}>Transactions</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Amount (ETH)</Th>
            <Th>Confirmations</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((tx) => (
            <Tr key={tx.id}>
              <Td>{tx.id}</Td>
              <Td>{tx.value}</Td>
              <Td>{tx.numConfirmations}/3</Td>
              <Td>
                <Badge colorScheme={tx.executed ? 'green' : 'yellow'}>
                  {tx.executed ? 'Executed' : 'Pending'}
                </Badge>
              </Td>
              <Td>
                {!tx.executed && (
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleConfirm(tx.id)}
                  >
                    Confirm
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default TransactionList;