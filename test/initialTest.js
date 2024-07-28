const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 smart contracts testing :", function () {
  let tokens;
  let accounts;
  const amount = ethers.parseEther("1");

  // The above line will take input in string format and converts them into ethers/wei format......
  before(async () => {
    const contract = await ethers.getContractFactory("OnePiece");
    // used to fetch abi...
    tokens = await contract.deploy(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
    // wait for contract to be deployed
    accounts = await ethers.getSigners();
    // used to get the signed accounts present in hardhat
    await tokens.waitForDeployment();
    // used to display the contract details
  });

  it("Assign initial supply", async function () {
    const totalsupply = await tokens.totalSupply();
    expect(await tokens.balanceOf(accounts[0].address)).to.equal(totalsupply);
  });

  it("Do not have permission to mint tokens without owner account", async function () {
    const wallet = tokens.connect(accounts[2]);
    expect(wallet.mint(accounts[2].address, amount)).to.be.reverted;
  });

  it("Do not have permission to burn tokens without owner account", async function () {
    const wallet = tokens.connect(accounts[2]);
    expect(wallet.burn(accounts[2].address, amount)).to.be.reverted;
  });

  it("Anyone can buy tokens", async function () {
    const wallet = tokens.connect(accounts[2]);
    const option = { value: amount };
    const calculate = amount * BigInt(1000); //1 ether = 1000 tokens declared in smartcontract
    await wallet.buy(option);
    expect(await wallet.balanceOf(accounts[2].address)).to.equal(calculate);
  });
  it("you will not able to withdraw amount without owner's account", async function () {
    const wallet = tokens.connect(accounts[2]);
    await expect(wallet.withdraw(amount)).to.be.reverted;
  });
  it("transfer amount to destination accounts", async function () {
    await tokens.transfer(accounts[1].address, amount);
    expect(await tokens.balanceOf(accounts[1].address)).to.equal(amount);
  });
  it("cannot transfer above the amounts", async function () {
    const wallet = tokens.connect(accounts[3]);
    await expect(wallet.transfer(accounts[2].address, 1)).to.be.reverted;
  });
  it("Only owner can mint tokens", async function () {
    const beforeMint = await tokens.balanceOf(accounts[0].address);
    await tokens.mint(accounts[0].address, amount);
    const afterMint = await tokens.balanceOf(accounts[0].address);
    const expectedAmount = beforeMint + amount;
    expect(afterMint).to.equal(expectedAmount);
  });
  it("Only owner can burn tokens", async function () {
    const beforeburn = await tokens.balanceOf(accounts[0].address);
    await tokens.burn(accounts[0].address, amount);
    const afterburn = await tokens.balanceOf(accounts[0].address);
    const expectedAmount = beforeburn - amount;
    expect(afterburn).to.equal(expectedAmount);
  });
  it("only owner can withdraw ethers from smart contract", async function () {
    const before_withdraw = await ethers.provider.getBalance(
      accounts[0].address
    );
    await tokens.withdraw(amount);
    const after_withdraw = await ethers.provider.getBalance(
      accounts[0].address
    );
    expect(after_withdraw).to.be.above(before_withdraw);
  });
});
