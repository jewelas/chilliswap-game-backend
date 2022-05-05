const Web3 = require('web3')
const Web3WsProvider = require('web3-providers-ws');
const Web3HttpProvider = require('web3-providers-http');
const chilliNftAbi = require('../contract/ChilliNft.json');

const {WSoptions}  = require('./config')

//const {startListening} = require('../events/transfer')

const web3 = new Web3(new Web3HttpProvider(process.env.RPC_HTTP_URL_TESTNET))
const WSweb3 = new Web3( new Web3WsProvider(process.env.RPC_WS_URL_TESTNET, WSoptions))

const {CHILLINFT_CONTRACT_ADDRESS} = require('../constant')



const chilliNftContract = new web3.eth.Contract(
  chilliNftAbi,
  CHILLINFT_CONTRACT_ADDRESS
)

//startListening(erc271Contract,marketContract)


module.exports = {
    web3,
    WSweb3: WSweb3,
    chilliNftContract:chilliNftContract,
}
  