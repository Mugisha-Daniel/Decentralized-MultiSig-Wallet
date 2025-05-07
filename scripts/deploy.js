const hre = require("hardhat");

async function main() {
  const [deployer, addr1, addr2] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(
    [deployer.address, addr1.address, addr2.address], // Initial owners
    2 // Required confirmations
  );

  // Wait for the contract to be deployed
  await multiSigWallet.waitForDeployment();

  const address = await multiSigWallet.getAddress();
  console.log("MultiSigWallet deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });