const WEB3 = require('web3')
const { getEthLikeWallet } = require('./helpers/getEthLikeWallet')
const KYCContractData = require('./abi/SBT.json')

const initWeb3 = () => {
  const {
    FROM_CHAIN_ID,
    FROM_CHAIN_RPC,
    FROM_CONTRACT,
    TO_CHAIN_ID,
    TO_CHAIN_RPC,
    TO_CONTRACT,
    ORACLE_SEED,
  } = process.env

  console.log(`>> Initing Web3 - from ${FROM_CHAIN_ID} to ${TO_CHAIN_ID}`)
  
  const wallet = getEthLikeWallet({ mnemonic: process.env.ORACLE_SEED })

  console.log('>>> Oracle Address:', wallet.address)
  
  console.log('>>> From RPC', FROM_CHAIN_RPC)
  const from_web3 = new WEB3(new WEB3.providers.HttpProvider(FROM_CHAIN_RPC))
  const from_account = from_web3.eth.accounts.privateKeyToAccount( wallet.privateKey )
  from_web3.eth.accounts.wallet.add( from_account.privateKey )

  console.log('>>> To RPC', TO_CHAIN_RPC)
  const to_web3 = new WEB3(new WEB3.providers.HttpProvider(TO_CHAIN_RPC))
  const to_account = from_web3.eth.accounts.privateKeyToAccount( wallet.privateKey )
  to_web3.eth.accounts.wallet.add( to_account.privateKey )
  
  console.log('>>> Web3 inited')

  console.log('>>>> Init KYC Contracts')
  const from_kyc = new from_web3.eth.Contract(KYCContractData.abi, FROM_CONTRACT)
  console.log('>>> KYC contract from inited', FROM_CONTRACT)
  const to_kyc = new from_web3.eth.Contract(KYCContractData.abi, TO_CONTRACT)
  console.log('>>> KYC contract to inited', TO_CONTRACT)
  return {
    oracleAddress: wallet.address,
    from: {
      chainId: FROM_CHAIN_ID,
      web3: from_web3,
      contract: from_kyc,
    },
    to: {
      chainId: TO_CHAIN_ID,
      web3: to_web3,
      contract: to_kyc,
    }
  }
}

module.exports = { initWeb3 }