import { ethers } from "hardhat";

async function main() {
  const myToken = await ethers.deployContract("MyToken");
  myToken.waitForDeployment();
  console.log(`MyToken deployed to: ${myToken.target}`);

  const myERC20 = await ethers.deployContract("MyERC20");
  await myERC20.waitForDeployment();
  console.log(`MyERC20 deployed to: ${myERC20.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
