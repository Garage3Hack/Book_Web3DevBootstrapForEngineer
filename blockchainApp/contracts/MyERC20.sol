// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
// OpenZeppelinのERC-20をインポート
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // オーナー権限を管理するコントラクトを追加
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol"; // 投票に必要な拡張コントラクトを追加
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol"; // 投票に必要な拡張コントラクトを追加
import "@openzeppelin/contracts/access/AccessControl.sol"; // アクセス制御するコントラクトを追加

// インポートしたERC-20を継承してMyERC20を作成する
contract MyERC20 is ERC20, Ownable, ERC20Permit, ERC20Votes, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // トークンの名前と単位を渡す
    constructor() ERC20("MyERC20", "ME2") ERC20Permit("MyERC20") {
        // トークンを作成者に1000000渡す
        _mint(msg.sender, 1000000);
        Ownable(msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
    * @dev トークンを発行（Mint）します。
    * この関数は MINTER_ROLE を持つアドレスだけが呼び出すことができます。
    * @param to トークンの受け取り先アドレス
    * @param amount 発行量
    */
    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
    }

    /**
     * @dev トークンを発行（Mint）する内部関数。
     * ERC20とERC20Votesでオーバーライドが必要です。
     * @param to トークンの受け取り先アドレス
     * @param amount 発行量
     */
    function _mint(
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    /**
     * @dev トークンの転送後に呼び出される内部関数。
     * ERC20とERC20Votesでオーバーライドが必要です。
     * @param from 送信元アドレス
     * @param to 送信先アドレス
     * @param amount 転送量
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    /**
     * @dev トークンを焼却（Burn）する内部関数。
     * ERC20とERC20Votesでオーバーライドが必要です。
     * @param account 焼却するトークンの所有者アドレス
     * @param amount 焼却量
     */
    function _burn(
        address account,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }

    /**
    * @dev MINTER_ROLE を新たなアドレスに割り当てます。
    * この関数はコントラクトのオーナーだけが呼び出すことができます。
    * @param minterAddress MINTER_ROLE を割り当てるアドレス
    */
    function grantMinterRole(address minterAddress) public onlyOwner {
        _grantRole(MINTER_ROLE, minterAddress);
    }

    /**
    * @dev タイムスタンプベースのチェックポイント（および投票）を実装するための時計を返します。
    * ERC6372ベースで、ブロックベースではなくタイムスタンプベースのGovernorに使用されます。
    * Hardhatでのテストネットワークではテストできないため、利用しません。
    * @return 現在のタイムスタンプ（秒）
    */
    // function clock() public view override returns (uint48) {
    //     return uint48(block.timestamp);
    // }

    /**
    * @dev このGovernorがタイムスタンプベースで動作することを示すモード情報を返します。
    * ERC6372ベースで、ブロックベースではなくタイムスタンプベースのGovernorに使用されます。
    * Hardhatでのテストネットワークではテストできないため、利用しません。
    * @return タイムスタンプベースのモードを示す文字列
    */
    // function CLOCK_MODE() public pure override returns (string memory) {
    //     return "mode=timestamp";
    // }
    
}
