const Web3 = require('web3')
const erc20Json = require('../contract/Token.json')
const erc721Json = require('../contract/ChilliSwap.json')
const marketJson = require('../contract/Market.json')

const WSoptions  = require('./config')

const {startListening} = require('../events/transfer')

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_HTTP_URL))
//let WSweb3 = null //new Web3(new Web3.providers.WebsocketProvider(process.env.RPC_WS_URL), WSoptions)

const {TOKEN_CONTRACT_ADDRESSS,CHILLISWAP_CONTRACT_ADDRESSS,MARKET_CONTRACT_ADDRESSS} = require('../constant')

const debug = (...messages) => console.log(...messages)

const WSweb3 = new Web3()
let erc20Token = null
let erc271Contract = null
let marketContract = null


/**
 * Refreshes provider instance and attaches even handlers to it
 */
function refreshProvider(web3Obj, providerUrl) {
  let retries = 0

  function retry(event) {
    if (event) {
      debug('Web3 provider disconnected or errored.')
      retries += 1

      if (retries > 5) {
        debug(`Max retries of 5 exceeding: ${retries} times tried`)
        return setTimeout(refreshProvider, 5000)
      }
    } else {
      debug(`Reconnecting web3 provider ${config.eth.provider}`)
      refreshProvider(web3Obj, providerUrl)
    }

    return null
  }

  const provider = new Web3.providers.WebsocketProvider(providerUrl)
  provider.on('end', () => retry())
  provider.on('error', () => retry())

  web3Obj.setProvider(provider)

  debug('New Web3 provider initiated')


   erc20Token = new web3Obj.eth.Contract(
    erc20Json.abi,
    TOKEN_CONTRACT_ADDRESSS,
  )
   erc271Contract = new web3Obj.eth.Contract(
    erc721Json.abi,
    CHILLISWAP_CONTRACT_ADDRESSS,
  )
   marketContract = new web3Obj.eth.Contract(
    marketJson.abi,
    MARKET_CONTRACT_ADDRESSS,
  )

  startListening(erc271Contract,marketContract)


  return provider
}



refreshProvider(WSweb3, process.env.RPC_WS_URL)

setTimeout(()=>{
  console.log()
}, 5000)



module.exports = {
    web3,
    WSweb3: WSweb3,
    ERC20Token:erc20Token,
    erc271Contract:erc271Contract,
    marketContract:marketContract,
}
  