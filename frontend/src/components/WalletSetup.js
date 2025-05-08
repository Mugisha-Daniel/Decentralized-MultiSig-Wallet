import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Box, Button, Text, VStack, HStack, Badge } from '@chakra-ui/react';

function WalletSetup() {
  const { account, connectWallet, owners } = useWeb3();

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Wallet Configuration (2/3)</Text>
        
        {!account ? (
          <Button colorScheme="blue" onClick={connectWallet}>
            Connect MetaMask
          </Button>
        ) : (
          <>
            <HStack>
              <Text>Connected Account:</Text>
              <Badge colorScheme="green">{account}</Badge>
            </HStack>
            
            <Box>
              <Text fontWeight="bold">Current Owners:</Text>
              {owners.map((owner, index) => (
                <Text key={index} fontSize="sm">
                  Owner {index + 1}: {owner}
                  {owner.toLowerCase() === account.toLowerCase() && " (You)"}
                </Text>
              ))}
            </Box>
            
            <Box>
              <Text>Required Confirmations: 2</Text>
              <Text>Total Owners: 3</Text>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
}

export default WalletSetup;