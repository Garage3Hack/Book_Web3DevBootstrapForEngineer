import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { network, ethers } from "hardhat";

// MyGovernor コントラクトのテストスイートを定義
describe("MyGovernor Contract", function () {

    // テストフィクスチャをデプロイする非同期関数を定義
    async function deployFixture() {

        // Signerのリストを取得
        const [owner, authAccount, nonAuthAccount] = await ethers.getSigners();

        // MyERC20 Contractをデプロイする
        const myERC20 = await ethers.deployContract("MyERC20");
        await myERC20.waitForDeployment();

        // TimelockControllerをデプロイする
        const myTimelockController = await ethers.deployContract("MyTimelockController", [60 * 2 /* 2 minutes */, [authAccount.getAddress()], [authAccount.getAddress()], owner.getAddress()]);
        await myTimelockController.waitForDeployment();

        // MyGovernor Contractをデプロイする
        const myGovernor = await ethers.deployContract("MyGovernor", [myERC20.target, myTimelockController.target]);
        await myGovernor.waitForDeployment();

        // 各種ロールを定義
        const proposerRole = await myTimelockController.PROPOSER_ROLE();
        const executorRole = await myTimelockController.EXECUTOR_ROLE();
        const adminRole = await myTimelockController.TIMELOCK_ADMIN_ROLE();

        // ロールを付与および削除
        await myTimelockController.grantRole(proposerRole, myGovernor.target);
        await myTimelockController.grantRole(executorRole, "0x0000000000000000000000000000000000000000");
        await myTimelockController.revokeRole(adminRole, owner.getAddress());

        // 投票者として利用するアカウントに投票権としてのERC-20トークンを払い出す
        await myERC20.mint(authAccount, 1000000);

        // mint権限をTimelockControllerのアドレスに付与する
        await myERC20.grantMinterRole(myTimelockController.target);

        return { owner, authAccount, nonAuthAccount, myERC20, myTimelockController, myGovernor};
    }

    describe("MyGovernorの初期化テスト", function () {
        it("ガバナンストークンの初期設定が正しくできているかのテスト", async function () {
            const { myERC20, myGovernor } = await loadFixture(deployFixture);

            // ガバナンストークンが正しく設定されていること
            expect(await myGovernor.token()).to.equal(myERC20.target);
        });

        it("TimelockControllerの初期設定が正しくできているかのテスト", async function () {
            const { myTimelockController, myGovernor } = await loadFixture(deployFixture);

            // TimelockControllerが正しく設定されていること
            expect(await myGovernor.timelock()).to.equal(myTimelockController.target);
        });


        it("投票遅延の初期設定が正しくできているかのテスト", async function () {
            const { myGovernor } = await loadFixture(deployFixture);

            // votingDelayが正しく設定されていること
            expect(await myGovernor.votingDelay()).to.equal(0);
        });

        it("投票期間の初期設定が正しくできているかのテスト", async function () {
            const { myGovernor } = await loadFixture(deployFixture);

            // votingPeriodが正しく設定されていること
            expect(await myGovernor.votingPeriod()).to.equal(2);
        });

        it("投票閾値の初期設定が正しくできているかのテスト", async function () {
            const { myGovernor } = await loadFixture(deployFixture);

            // proposalThresholdが正しく設定されていること
            expect(await myGovernor.proposalThreshold()).to.equal(0);
        });
    });


    describe("提案作成から実行機能のテスト", function () {
        it("権限がある人が正しく提案を作成し、実行まで完了できるかのテスト", async function () {
            const { authAccount, myGovernor, myERC20 } = await loadFixture(deployFixture);

            // 提案実行前に、対象のアカウントは1000000トークンのみ保持していることを確認
            const myERC20WithAuthorized = myERC20.connect(authAccount);
            expect(await myERC20WithAuthorized.balanceOf(await authAccount.getAddress())).to.equal(1000000);  // 1000000 initial

            // 自身に委任する
            await myERC20WithAuthorized.delegate(await authAccount.getAddress());

            // 委任が成功したことを確認
            expect(await myERC20WithAuthorized.delegates(await authAccount.getAddress())).to.equal(await authAccount.getAddress());

            // 提案の詳細を定義
            const proposal = {
                targets: [myERC20.target],
                values: [0],
                calldatas: [myERC20.interface.encodeFunctionData("mint", [await authAccount.getAddress(), 1000000])],
                description: "Mint 1000000 tokens to authAccount"
            };

            // authAccount を使用して myGovernor に接続
            const myGovernorWithAuthorized = myGovernor.connect(authAccount);

            // 提案を作成
            await myGovernorWithAuthorized.propose(
                proposal.targets,
                proposal.values,
                proposal.calldatas,
                proposal.description
            );

            // 提案IDを計算
            const proposalId = await myGovernorWithAuthorized.hashProposal(
                proposal.targets,
                proposal.values,
                proposal.calldatas,
                ethers.keccak256(ethers.toUtf8Bytes(proposal.description))
            );

            // 提案の状態を確認し、Pending状態であることを確認
            expect(await myGovernorWithAuthorized.state(proposalId)).to.equal(0, "proposal is not Pending"); // 0 is the enum value for "Pending"

            // ブロックを進め、提案の投票が開始されるようにする
            await network.provider.send("hardhat_mine", ["0x1"]);

            // 提案の状態を確認し、投票中のActive状態であることを確認
            expect(await myGovernorWithAuthorized.state(proposalId)).to.equal(1, "proposal is not Active"); // 1 is the enum value for "Active"

            // 賛成票を投票
            await myGovernorWithAuthorized.castVote(proposalId, 1);  // 1 is the enum value for "For"

            // 投票を実施したかを確認
            const isVoted = await myGovernorWithAuthorized.hasVoted(proposalId, await authAccount.getAddress());
            expect(isVoted).to.equal(true);

            // 投票の状況を取得
            const proposalVotesResponse = await myGovernorWithAuthorized.proposalVotes(proposalId);

            // 想定通りの投票の状況になっていることを確認（賛成1000000票、反対0票、棄権0票）
            expect(proposalVotesResponse.againstVotes).to.equal(0, "proposal againstVotes is not 0");
            expect(proposalVotesResponse.forVotes).to.equal(1000000, "proposal forVotes is not 1000000");
            expect(proposalVotesResponse.abstainVotes).to.equal(0, "proposal abstainVotes is not 0");

            // 投票期間が完了するようにブロックを進める
            await network.provider.send("hardhat_mine", ["0x1"]);

            // 提案の状態を確認し、賛成多数で成功Succeeded状態であることを確認
            expect(await myGovernor.state(proposalId)).to.equal(4); // 4 is the enum value for "Succeeded"

            // Succeeded状態であった提案を実行キューに入れる
            await myGovernorWithAuthorized.queue(
                proposal.targets,
                proposal.values,
                proposal.calldatas,
                ethers.keccak256(ethers.toUtf8Bytes(proposal.description))
            );

            // 提案の状態を確認し、実行キューに入っているQueued状態であることを確認
            expect(await myGovernorWithAuthorized.state(proposalId)).to.equal(5); // 5 is the enum value for "Queued"

            // TimelockControllerで設定した遅延時間(120sec)を経過させる
            await network.provider.send("evm_increaseTime", [120]);

            // 提案を実行する
            await myGovernorWithAuthorized.execute(
                proposal.targets,
                proposal.values,
                proposal.calldatas,
                ethers.keccak256(ethers.toUtf8Bytes(proposal.description))
            );

            // 提案の状態を確認し、実行済みExecuted状態であることを確認
            expect(await myGovernorWithAuthorized.state(proposalId)).to.equal(7); // 7 is the enum value for "Executed"

            // 提案が実行され、想定通り、対象のアカウントに1000000トークンが追加付与され、2000000トークンになっていることを確認
            expect(await myERC20WithAuthorized.balanceOf(await authAccount.getAddress())).to.equal(2000000);  // 1000000 initial + 1000000 minted

        });        

    });
});