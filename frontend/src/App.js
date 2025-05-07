import React from 'react';
import { VStack } from '@chakra-ui/react';
import Header from './components/Header';
import WalletInfo from './components/WalletInfo';
import CreateTransaction from './components/CreateTransaction';
import TransactionList from './components/TransactionList';

function App() {
  return (
    <VStack spacing={8} p={4}>
      <Header />
      <WalletInfo />
      <CreateTransaction />
      <TransactionList />
    </VStack>
  );
}

export default App;