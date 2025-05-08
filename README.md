# 🧾 Decentralized Multi-Signature Wallet

A secure decentralized multi-signature wallet DApp built with **Solidity**, **Hardhat**, and **React**. This wallet allows multiple wallet owners to manage and approve transactions collectively. It's ideal for DAOs, joint accounts, and organizations needing shared control over funds.

---

## 🚀 Features

✅ Multi-owner setup with flexible configuration  
✅ Require multiple confirmations before executing a transaction  
✅ Deposit, submit, confirm, revoke, and execute transactions  
✅ Real-time wallet balance and transaction history  
✅ Seamless integration with MetaMask  
✅ Frontend built with React and Ethers.js  
✅ Deployed locally via Hardhat Network

---

## 📦 Tech Stack

- **Smart Contracts**: Solidity (MultiSigWallet)
- **Blockchain Framework**: Hardhat
- **Frontend**: React.js, Ethers.js
- **Wallet Integration**: MetaMask
- **Testing**: Mocha & Chai (optional)
- **Deployment**: Hardhat Localhost Network

---

## ✅ Prerequisites

- Node.js (v14+)
- npm (or yarn)
- MetaMask browser extension
- Git & GitHub
- Hardhat (installed via npm)

---

## ⚙️ Setup Instructions

### 1. Clone the Project
```bash
git clone https://github.com/Mugisha-Daniel/Decentralized-MultiSig-Wallet.git
cd Decentralized-MultiSig-Wallet
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Compile Contracts
```bash
npx hardhat compile
```

### 4. Start Local Hardhat Blockchain
```bash
npx hardhat node
```

### 5. Deploy the Contract to Localhost
(Use another terminal)
```bash
npx hardhat run scripts/deploy.js --network localhost
```

> ⚠️ Note the deployed contract address and update it in your frontend (`src/contracts/contract-address.js`)

---

### 6. Setup Frontend
```bash
cd frontend
npm install
```

### 7. Start the React App
```bash
npm start
```

---

## 🔗 MetaMask Configuration (Localhost)

1. Open MetaMask → Add Network
2. Use these settings:
   - **Network Name**: Hardhat Localhost
   - **New RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
3. Import an account from Hardhat using one of the private keys shown when you ran `npx hardhat node`.

---

## 📸 Screencast Instructions

- Record a video using Windows Game Bar (`Win + G`) or OBS Studio
- Show:
  - Contract deployment
  - Metamask connection
  - Creating and confirming transactions
  - Executing transactions
- Upload your video to [YouTube](https://youtube.com), [Streamable](https://streamable.com), or [Google Drive](https://drive.google.com)

---


## 🙌 Credits

Created by **Mugisha Daniel** for the BTech Blockchain Final Exam.
