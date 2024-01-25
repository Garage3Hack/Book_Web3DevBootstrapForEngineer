import { ethers } from "hardhat";

async function main() {
    const myToken = await ethers.deployContract("MyToken");
    myToken.waitForDeployment();
    console.log(`MyToken deployed to: ${myToken.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
