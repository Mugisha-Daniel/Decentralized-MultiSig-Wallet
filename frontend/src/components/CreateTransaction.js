import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

function CreateTransaction() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { contract, provider } = useWeb3();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!provider || !contract) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther(value)
      });
      
      await tx.wait();
      
      toast({
        title: 'Success',
        description: `Successfully sent ${value} ETH to the wallet`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setValue('');
    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        toast({
          title: 'Transaction Cancelled',
          description: 'You rejected the transaction',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="full" maxW="container.md" p={6} bg="white" rounded="lg" shadow="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Amount (ETH)</FormLabel>
            <Input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter ETH amount"
              disabled={isLoading}
            />
          </FormControl>
          <Button 
            type="submit" 
            colorScheme="blue" 
            w="full"
            isLoading={isLoading}
            loadingText="Sending..."
          >
            Send ETH
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default CreateTransaction;