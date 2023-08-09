const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DXToken contract", function () {
    it("トークンの全供給量を所有者に割り当てる", async function () {
        // デフォルトで取得できるアカウントをOwnerとして設定
        const [owner] = await ethers.getSigners();
        
        // DXTokenをデプロイ
        const hardhatToken = await ethers.deployContract("DXToken");
        
        // balanceOf関数を呼び出しOwnerのトークン量を取得
        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        
        // Ownerのトークン量がこのコントラクトの全供給量に一致するか確認
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
});