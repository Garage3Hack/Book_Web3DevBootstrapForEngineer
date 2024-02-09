// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// OpenZeppelinライブラリからTimelockControllerをインポート
import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @dev MyTimelockControllerは、OpenZeppelinのTimelockControllerを拡張したコントラクトです。
 * TimelockControllerは一定時間遅延後にトランザクションを実行可能にするスマートコントラクトです。
 */
contract MyTimelockController is TimelockController {
    /**
     * @dev コンストラクタでTimelockControllerを初期化します。
     * @param minDelay トランザクションが遅延される最小時間（秒）
     * @param proposers 提案を行えるアドレスのリスト
     * @param executors 実行を行えるアドレスのリスト
     * @param admin 管理者のアドレス
     */
    constructor(
        uint minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
