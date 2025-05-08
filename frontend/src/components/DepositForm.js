import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  Text
} from '@chakra-ui/react';

function DepositForm() {
  const { depositETH, balance } = useWeb3();
  const [amount, setAmount] = useState('');
  const toast = useToast();

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await depositETH(amount);
      toast({
        title: 'Success',
        description: `Deposited ${amount} ETH to contract`,
        status: 'success',
        duration: 5000,
      });
      setAmount('');
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
    <Box p={6} borderWidth="1px" borderRadius="lg" mb={4}>
      <Text mb={4}>Contract Balance: {parseFloat(balance).toFixed(4)} ETH</Text>
      <form onSubmit={handleDeposit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Deposit Amount (ETH)</FormLabel>
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
            colorScheme="green" 
            width="full"
            isDisabled={!amount || parseFloat(amount) <= 0}
          >
            Deposit ETH
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default DepositForm;