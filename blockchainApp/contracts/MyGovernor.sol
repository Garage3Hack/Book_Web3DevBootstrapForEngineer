// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

/**
 * @dev MyGovernorコントラクトはOpenZeppelinのいくつかのガバナンス拡張を継承しています。
 * これにより、総合的なガバナンス機能を備えたスマートコントラクトを作成します。
 */
contract MyGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    /**
     * @dev コンストラクタは各種設定と初期値を定義します。
     * @param _token 投票に使用されるトークン
     * @param _timelock タイムロックコントローラー
     */
    constructor(
        IVotes _token,
        TimelockController _timelock
    )
        Governor("MyGovernor")
        GovernorSettings(0 /* 遅延なし */, 2 /* 2 block */, 0)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
    {}

    /**
     * @dev 投票の遅延時間を返します。
     * @return 投票の遅延時間（秒）
     */
    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    /**
     * @dev 投票の有効期間を返します。
     * @return 投票の有効期間（秒）
     */
    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    /**
     * @dev 指定されたブロック番号における必要なクォーラム（最小投票数）を返します。
     * クォーラムは提案が有効であると見なされるために必要な最小投票数を表します。
     * @param blockNumber クォーラムを計算するブロックの番号
     * @return 必要なクォーラム数
     */
    function quorum(
        uint256 blockNumber
    )
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    /**
     * @dev 提案IDの現在の状態を返します。
     * @param proposalId 提案ID
     * @return 提案の状態
     */
    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    /**
     * @dev 新しい提案を作成します。
     * @param targets 提案の対象となるアドレスの配列
     * @param values 提案の対象となるアドレスに送る値（ETH）の配列
     * @param calldatas 提案の対象となるアドレスに送る関数呼び出しデータの配列
     * @param description 提案の説明
     * @return 提案ID
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    /**
     * @dev 提案が通るために必要な投票数を返します。
     * @return 提案が通るために必要な投票数。
     */
    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    /**
     * @dev 既存の提案を実行します。
     * @param proposalId 実行する提案のID
     * @param targets 提案の対象となるアドレスの配列
     * @param values 提案の対象となるアドレスに送る値（ETH）の配列
     * @param calldatas 提案の対象となるアドレスに送る関数呼び出しデータの配列
     * @param descriptionHash 提案の説明のハッシュ
     */
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    /**
     * @dev 既存の提案をキャンセルします。
     * @param targets 提案の対象となるアドレスの配列
     * @param values 提案の対象となるアドレスに送る値（ETH）の配列
     * @param calldatas 提案の対象となるアドレスに送る関数呼び出しデータの配列
     * @param descriptionHash 提案の説明のハッシュ
     * @return キャンセルされた提案のID
     */
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    /**
     * @dev 実行者（Executor）を返します。この場合はタイムロックコントローラーです。
     * @return 実行者のアドレス
     */
    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    /**
     * @dev コントラクトがサポートするインターフェースを確認します。
     * @param interfaceId インターフェースのID
     * @return サポートしているかどうか（真偽値）
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
