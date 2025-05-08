async function main() {
    const [owner1, owner2, owner3] = await ethers.getSigners();
    
    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    const multiSigWallet = await MultiSigWallet.deploy([
        owner1.address,
        owner2.address,
        owner3.address
    ]);

    // Wait for deployment to complete
    await multiSigWallet.waitForDeployment();

    console.log("MultiSigWallet deployed to:", await multiSigWallet.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });