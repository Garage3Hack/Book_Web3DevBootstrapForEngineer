import 'dotenv/config'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    poanet: {
      url: `${process.env.POANET_URL}`,
      accounts: [`0x${process.env.POANET_PRIVATE_KEY}`],
    },
    sepolia: {
      url: `${process.env.ALCHEMY_SEPOLIA_URL}`,
      accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY}`],
    }
  },
};

export default config;
