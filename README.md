# ブロックチェーンサンプル（Appendix）　 ローカル環境にイーサリアムネットワークを構築する(A1.1)

## リスト33. Macの場合の接続確認（API_KEYは自身の値で置き換えてください）
```
curl https://eth-mainnet.g.alchemy.com/v2/{API_KEY} -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest", false],"id":0}'
```

## リスト34. Windowsの場合の接続確認
```
curl https://eth-sepolia.g.alchemy.com/v2/-ZLcVNEjp1_5cpjDuvxdQX4S8jsz8zoG -X POST -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBlockByNumber\",\"params\":[\"latest\", false],\"id\":0}"
```

## リスト39. Alchemyへのスマートコントラクトのデプロイ
```
npx hardhat run --network sepolia scripts/deploy-local.ts
```

## リスト41. Webアプリケーションの起動
```
npm run dev
```