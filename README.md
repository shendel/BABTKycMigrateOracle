# BABT Kyc Migrate Oracle

Backend service for migrating Binance KYC (BABT) verification to other networks

## Installation


```
npm install
```

## Configuration
1. Deploy contract (`contracts/SBT.sol`) in needed chain (can be used Remix)
2. Grand role for Oracle operator role by call `grantRole`

Operator role hash is `0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929`

Optinaly set tokenUrl by call `setBaseTokenURI` with args `https://www.binance.info/bapi/asset/v1/public/wallet-direct/babt/metadata/`

1. Copy .env.sample to .env and edit

`ORACLE_SEED` - Oracle 12 words seed secret phrase

`FROM_CHAIN_ID` - Default BSC - 56

`FROM_CHAIN_RPC` - Default BSC - https://bsc-dataseed.binance.org/

`FROM_CONTRACT` - Default BSC BABT token address - 0x2b09d47d550061f995a3b5c6f0fd58005215d7c8

`TO_CHAIN_ID` - Target chainId

`TO_CHAIN_RPC` - Target chain RPC

`TO_CONTRACT` - Target BABT Bridge token, deployed at step 1

## Run

```
npm run start
```


## Api methods

`/attest/{address}` - Migrate KYC verification

`/revoke/{address}` - Revoke KYC verification in target chain

`/check/{address}` - Retorn KYC verification status