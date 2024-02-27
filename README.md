# ブロックチェーンサンプル

本ソースコードは書籍「エンジニアのためのWeb3開発入門」に掲載している内容です。
各章である程度動く単位にbranchを分けていますので、書籍の進行度合いに合わせてbranchを切り替えてご利用ください。
各章で使用するコマンドは各branchのREADME.mdに記載しています。詳細な解説は書籍をご参照ください。

##　サンプルコードの取得
```
git clone https://github.com/Garage3Hack/Book_Web3DevBootstrapForEngineer.git
```

##　各章のサンプルコードの取得
```
git fetch
```

## ブランチ一覧の表示
```
git branch -a
```

## 任意のブランチを取得
```
git checkout -b 取得したいブランチ名 origin/取得したいブランチ名
例：git checkout -b 02_chapter3-erc-20 origin/02_chapter3-erc-20
```
## ローカルブランチ一覧の表示
```
git branch
```

## ブランチの切り替え
```
git checkout 切り替えたいブランチ名
```

## 編集したブランチを元の状態に戻す
```
git reset --hard HEAD
```

## ライブラリのインストール
```
npm install
```

# 事前準備

## リスト3. インデントの設定
```json:setting.json
{
    "workbench.colorTheme": "Default Dark Modern",
    "solidity.telemetry": true,
    "[typescript]": {
        "editor.tabSize": 2,
        "editor.insertSpaces": true        
    },
    "[typescriptreact]": {
        "editor.tabSize": 2,
        "editor.insertSpaces": true
    }
}
```

## nvmのインストール
Macの場合
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

Windowsの場合
https://github.com/coreybutler/nvm-windows/releases

## リスト4. nvmのバージョン確認
```
nvm –version
```

## リスト5. Node.jsのインストール
```
nvm install v18.15.0
```

## リスト6. v18.15.0の使用設定
```
nvm use v18.15.0
```

## リスト7. Node.jsのバージョン確認
```
node -v
```

# ブロックチェーンサンプル（4章）　 MyToken作成まで

## リスト8. プロジェクトフォルダの作成と移動 

```
mkdir blockchainApp
cd blockchainApp
```

## リスト9. プロジェクト初期化
```
npm init -y
```

## リスト10. Hardhatのインストール
```
npm install --save-dev hardhat@2.18.2
```

## リスト11. Hardhat-toolboxのインストール
```
npm install --save-dev @nomicfoundation/hardhat-toolbox@3.0.0
```

## リスト12. Hardhatプロジェクトの作成
```
npx hardhat init
```

## リスト13. OpenZeppelinのインストール
```
npm install @openzeppelin/contracts@4.9.3
```

## リスト15. スマートコントラクトのコンパイル
```
npx hardhat compile
```

## リスト18. テストの実行
```
npx hardhat test
```

## リスト19. Hardhatネットワークの起動
```
npx hardhat node
```

## リスト21. デプロイの実行
```
npx hardhat run --network localhost scripts/deploy-local.ts
```

## リスト23. Next.jsプロジェクトの作成
```
npx create-next-app --ts frontend
```

## リスト24. Next.jsをバージョン指定で再インストール
```
cd frontend
npm install --save-exact next@13.4.13 bufferutil@4.0.8 utf-8-validate@6.0.3
```

## リスト25. ライブラリの再インストール
```
npm install
```

## リスト26. ライブラリのインストール
```
npm install @tabler/icons-react@2.32.0 @mantine/core@7.0.0 @mantine/hooks@7.0.0
```

## リスト27. プラグインのインストール
```
npm install --save-dev postcss@8.4.29 postcss-preset-mantine@1.7.0 postcss-simple-vars@7.0.1
```

## リスト29. ehters.jsのインストール
```
npm install ethers@6.7.0
```

## リスト30. フロントエンド再実行
```
npm run dev
```

## リスト33. フロントエンド再実行
```
npm run dev
```
