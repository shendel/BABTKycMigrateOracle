require("dotenv").config()

const { isEvmAddress } = require("./helpers/isEvmAddress")
const { callContractMethod } = require("./helpers/callContractMethod")

const server_port = process.env.SERVER_PORT
const server_ip = process.env.SERVER_IP

const cors = require("cors")
const express = require("express")
const app = express()

const { initWeb3 } = require("./initWeb3")

const activeWeb3 = initWeb3()

app.use(cors())
app.use('/status', async(req, res) => {
  res.json({ answer: 'ok' })
})
app.use('/attest/:address', async (req, res) => {
  const { address } = req.params
  if (isEvmAddress(address)) {
    activeWeb3.to.contract.methods.balanceOf(address).call().then((alreadyHasAttest) => {
      if (alreadyHasAttest == 0) {
        activeWeb3.from.contract.methods.balanceOf(address).call().then((hasKyc) => {
          if (hasKyc != 0) {
            activeWeb3.from.contract.methods.tokenIdOf(address).call().then((tokenId) => {
              callContractMethod({
                activeWeb3: activeWeb3.to.web3,
                activeWallet: activeWeb3.oracleAddress,
                contract: activeWeb3.to.contract,
                method: 'attestId',
                args: [
                  address,
                  tokenId
                ]
              }).then((answer) => {
                res.json({ answer: 'attested' })
              }).catch((err) => {
                console.log(err)
                res.json({ error: 'fail attest' })
              })
            }).catch((err) => {
              res.json({ error: 'fail get tokenId' })
            })
          } else {
            res.json({ error: 'no kyc' })
          }
        }).catch((err) => {
          res.json({ error: 'fail get balanceOf' })
        })
      } else {
        res.json({ error: 'already attested' })
      }
    }).catch((err) => {
      res.json({ error: 'fail check attest' })
    })
  } else {
    res.json({ error: 'wrong address' })
  }
})
app.use('/revoke/:address', async (req, res) => {
  const { address } = req.params
  if (isEvmAddress(address)) {
    activeWeb3.to.contract.methods.balanceOf(address).call().then((alreadyHasAttest) => {
      if (alreadyHasAttest != 0) {
        callContractMethod({
          activeWeb3: activeWeb3.to.web3,
          activeWallet: activeWeb3.oracleAddress,
          contract: activeWeb3.to.contract,
          method: 'revoke',
          args: [
            address,
          ]
        }).then((answer) => {
          res.json({ answer: 'revoked' })
        }).catch((err) => {
          res.json({ error: 'fail revoke' })
        })
      } else {
        res.json({ error: 'no kyc' })
      }
    }).catch((err) => {
      console.log(err)
      res.json({ error: 'fail check attest' })
    })
  } else {
    res.json({ error: 'wrong address' })
  }
})


app.listen(server_port, server_ip, () => {
  console.log(`KYC Oracle started at http://${server_ip}:${server_port}`)
})


const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}


