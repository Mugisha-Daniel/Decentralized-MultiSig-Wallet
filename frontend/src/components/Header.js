import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';

function Header() {
  const { account, connectWallet } = useWeb3();

  return (
    <Box bg="blue.500" px={8} py={4}>
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold" color="white">
          MultiSig Wallet
        </Text>
        <Button
          onClick={connectWallet}
          colorScheme="whiteAlpha"
        >
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : 'Connect Wallet'}
        </Button>
      </Flex>
    </Box>
  );
}

export default Header;