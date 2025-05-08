import React from 'react';
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';

function WalletInfo() {
  const { balance, owners, account } = useWeb3();

  return (
    <Box w="full" maxW="container.md" p={6} bg="white" rounded="lg" shadow="md">
      <VStack align="stretch" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Contract Balance: {balance} ETH
        </Text>
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Owners:
          </Text>
          <VStack align="stretch">
            {owners.map((owner, index) => (
              <HStack key={index}>
                <Text>{owner}</Text>
                {owner.toLowerCase() === account?.toLowerCase() && (
                  <Badge colorScheme="green">You</Badge>
                )}
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default WalletInfo;