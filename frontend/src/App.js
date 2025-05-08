import React from 'react';
import { ChakraProvider, Container, VStack, Heading } from '@chakra-ui/react';
import { Web3Provider } from './context/Web3Context';
import WalletInfo from './components/WalletInfo';
import DepositForm from './components/DepositForm';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

function App() {
  return (
    <ChakraProvider>
      <Web3Provider>
        <Container maxW="container.md" py={8}>
          <VStack spacing={6}>
            <Heading>MultiSig Wallet</Heading>
            <WalletInfo />
            <DepositForm />
            <TransactionForm />
            <TransactionList />
          </VStack>
        </Container>
      </Web3Provider>
    </ChakraProvider>
  );
}

export default App;