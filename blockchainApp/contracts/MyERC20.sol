// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
// OpenZeppelinのERC-20をインポート
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// インポートしたERC-20を継承してMyERC20を作成する
contract MyERC20 is ERC20 {
    // トークンの名前と単位を渡す
    constructor() ERC20("MyERC20", "ME2") {
        // トークンを作成者に1000000渡す
        _mint(msg.sender, 1000000);
    }
}
