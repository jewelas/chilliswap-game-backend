const Web3 = require('web3')
const Web3WsProvider = require('web3-providers-ws');
const Web3HttpProvider = require('web3-providers-http');
const erc20Json = require('../contract/Token.json')
const erc721Json = require('../contract/ChilliSwap.json')
const marketJson = require('../contract/Market.json')

const {WSoptions}  = require('./config')

//const {startListening} = require('../events/transfer')

const web3 = new Web3(new Web3HttpProvider(process.env.RPC_HTTP_URL))
const WSweb3 = new Web3( new Web3WsProvider(process.env.RPC_WS_URL, WSoptions))

const {TOKEN_CONTRACT_ADDRESSS,CHILLISWAP_CONTRACT_ADDRESSS,MARKET_CONTRACT_ADDRESSS} = require('../constant')



const erc20Token = new WSweb3.eth.Contract(
  erc20Json.abi,
  TOKEN_CONTRACT_ADDRESSS,
)
const erc271Contract = new WSweb3.eth.Contract(
  erc721Json.abi,
  CHILLISWAP_CONTRACT_ADDRESSS,
)
const marketContract = new WSweb3.eth.Contract(
  marketJson.abi,
  MARKET_CONTRACT_ADDRESSS,
)

//startListening(erc271Contract,marketContract)


module.exports = {
    web3,
    WSweb3: WSweb3,
    ERC20Token: erc20Token,
    erc271Contract: erc271Contract,
    marketContract: marketContract,
}
  