const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSigWallet", function () {
  let MultiSigWallet;
  let multiSigWallet;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    multiSigWallet = await MultiSigWallet.deploy(
      [owner.address, addr1.address, addr2.address],
      2
    );
    await multiSigWallet.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct owners", async function () {
      const owners = await multiSigWallet.getOwners();
      expect(owners).to.have.lengthOf(3);
      expect(owners).to.include(owner.address);
      expect(owners).to.include(addr1.address);
      expect(owners).to.include(addr2.address);
    });

    it("Should set the correct number of required confirmations", async function () {
      const required = await multiSigWallet.numConfirmationsRequired();
      expect(required).to.equal(2);
    });
  });

  describe("Transactions", function () {
    it("Should submit transaction", async function () {
      const tx = await multiSigWallet.submitTransaction(
        addr3.address,
        ethers.utils.parseEther("1"),
        "0x"
      );
      await tx.wait();

      const transaction = await multiSigWallet.getTransaction(0);
      expect(transaction.to).to.equal(addr3.address);
      expect(transaction.value).to.equal(ethers.utils.parseEther("1"));
      expect(transaction.executed).to.equal(false);
    });

    it("Should confirm and execute transaction", async function () {
      // Send some ETH to the wallet
      await owner.sendTransaction({
        to: multiSigWallet.address,
        value: ethers.utils.parseEther("2"),
      });

      // Submit transaction
      await multiSigWallet.submitTransaction(
        addr3.address,
        ethers.utils.parseEther("1"),
        "0x"
      );

      // Confirm transaction
      await multiSigWallet.confirmTransaction(0);
      await multiSigWallet.connect(addr1).confirmTransaction(0);

      // Execute transaction
      await multiSigWallet.executeTransaction(0);

      const transaction = await multiSigWallet.getTransaction(0);
      expect(transaction.executed).to.equal(true);
    });

    it("Should fail if non-owner tries to submit transaction", async function () {
      await expect(
        multiSigWallet
          .connect(addr3)
          .submitTransaction(addr1.address, ethers.utils.parseEther("1"), "0x")
      ).to.be.revertedWith("not owner");
    });
  });
});