const Web3 = require('web3')
const Web3WsProvider = require('web3-providers-ws');
const Web3HttpProvider = require('web3-providers-http');
const chilliNftAbi = require('../contract/ChilliNft.json');
const chilliswapETHAbi = require("../contract/ChilliSwapETH.json");
const chilliswapPolygonAbi = require("../contract/ChilliSwapPolygon.json");
const chilliswapRinkebyAbi = require("../contract/ChilliSwapRinkeby.json");
const chilliswapMumbaiAbi = require("../contract/ChilliSwapMumbai.json");

const {WSoptions}  = require('./config')

//const {startListening} = require('../events/transfer')

const web3 = new Web3(new Web3HttpProvider(process.env.RPC_HTTP_URL_TESTNET))
const WSweb3 = new Web3( new Web3WsProvider(process.env.RPC_WS_URL_TESTNET, WSoptions))

const ethWeb3 = new Web3(new Web3HttpProvider(process.env.RPC_HTTP_URL_ETH))
const polygonWeb3 = new Web3(new Web3HttpProvider(process.env.RPC_HTTP_URL_POLYGON))

const rinkebyWeb3 = new Web3(new Web3HttpProvider(process.env.RPC_HTTP_URL_RINKEBY))

const mumbaiWeb3 = new Web3(new Web3HttpProvider(process.env.RPC_HTTP_URL_MUMBAI))

const {CHILLINFT_CONTRACT_ADDRESS, CHILLISWAP_CONTRACT_ADDRESS, CHILLISWAP_CONTRACT_ADDRESS_RINKEBY, CHILLISWAP_CONTRACT_ADDRESS_MUMBAI} = require('../constant')



const chilliNftContract = new web3.eth.Contract(
  chilliNftAbi,
  CHILLINFT_CONTRACT_ADDRESS
)

const chilliswapEthContract = new ethWeb3.eth.Contract(
  chilliswapETHAbi,
  CHILLISWAP_CONTRACT_ADDRESS
)

const chilliswapPolygonContract = new polygonWeb3.eth.Contract(
  chilliswapPolygonAbi,
  CHILLISWAP_CONTRACT_ADDRESS
)

const chilliswapRinkebyContract = new rinkebyWeb3.eth.Contract(
  chilliswapRinkebyAbi,
  CHILLISWAP_CONTRACT_ADDRESS_RINKEBY
)

const chilliswapMumbaiContract = new mumbaiWeb3.eth.Contract(
  chilliswapMumbaiAbi,
  CHILLISWAP_CONTRACT_ADDRESS_MUMBAI
)

//startListening(erc271Contract,marketContract)


module.exports = {
    web3,
    WSweb3: WSweb3,
    ethWeb3,
    polygonWeb3,
    rinkebyWeb3,
    mumbaiWeb3,
    chilliNftContract:chilliNftContract,
    chilliswapEthContract,
    chilliswapPolygonContract,
    chilliswapRinkebyContract,
    chilliswapMumbaiContract
}
  