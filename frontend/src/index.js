import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { Web3Provider } from './context/Web3Context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </ChakraProvider>
  </React.StrictMode>
);