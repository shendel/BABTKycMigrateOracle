require("dotenv").config()

const { fromWei, toWei } = require('./helpers/wei')
const { BigNumber } = require('bignumber.js')

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
})
app.use('/revoke/:address', async (req, res) => {
  const { address } = req.params
})


app.listen(server_port, server_ip, () => {
  console.log(`Bridge backend status info started at http://${server_ip}:${server_port}`)
})


const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}


