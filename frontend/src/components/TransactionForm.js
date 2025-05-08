import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast
} from '@chakra-ui/react';

function TransactionForm() {
  const { submitTransaction, isOwner, account } = useWeb3();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const toast = useToast();

  const checkOwner = (address) => {
    if (!address) return false;
    return isOwner(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account || !recipient) {
      toast({
        title: 'Error',
        description: 'Please provide all required fields',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    if (!ethers.utils.isAddress(recipient)) {
      toast({
        title: 'Error',
        description: 'Invalid recipient address',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    try {
      await submitTransaction(recipient, amount);
      toast({
        title: 'Success',
        description: 'Transaction submitted',
        status: 'success',
        duration: 5000,
      });
      setAmount('');
      setRecipient('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Recipient Address</FormLabel>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Amount (ETH)</FormLabel>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
            />
          </FormControl>
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full"
            isDisabled={!account || !checkOwner(account) || !recipient || !amount}
          >
            {!account ? 'Connect Wallet' : !checkOwner(account) ? 'Not an Owner' : 'Submit Transaction'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default TransactionForm;