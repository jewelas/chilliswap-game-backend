const { WSweb3, erc271Contract, marketContract } = require('../service/web3')

const { mint, listOnAuction, bid, claimNft } = require('../functions/token')

const TO_BLOCK_RANGE = 50000
//const EVENT_TYPES = ['Mint', 'ListOnAuction', 'Bid', 'ClaimNft']


// setInterval(async()=>{
//   console.log("fidning")
//   await findEvent("Mint")
// },1000)


const findEvent = (type) => {
  return new Promise(async (resolve, reject) => {
    try {

      const blockNum = await WSweb3.eth.getBlockNumber()
      const fromBlock = blockNum - TO_BLOCK_RANGE
      let eventsPromises = []
      let contract = null

      if(type === "Mint"){
        contract = erc271Contract
      }else{
        contract = marketContract
      }

      contract.getPastEvents(
        type,
        { filter: {}, fromBlock: fromBlock, toBlock: 'latest' },
        function (error, events) {
          if (error) {
            reject(error)
            return
          }
      //    console.log(events)
          events.forEach((event) => {
            switch (type) {
              case 'Mint':
                eventsPromises.push(mint(event))
                break
              case 'ListOnAuction':
                eventsPromises.push(listOnAuction(event))
                break
              case 'Bid':
                eventsPromises.push(bid(event))
                break
              case 'ClaimNft':
                eventsPromises.push(claimNft(event))
                break
            }
          })

          Promise.allSettled(eventsPromises)
            .then((response) => {
              resolve(response)
              return
            })
            .catch((err) => {
              reject(err)
              return
            })
        },
      )
    } catch (err) {
      reject(err)
      return
    }
  })
}


const findMissedEvents = async ()=>{
  console.log("finding events that we might have missed")
  await findEvent("Mint")
  await findEvent("ListOnAuction")
  await findEvent("Bid")
  await findEvent("ClaimNft")
  console.log("finished finding events")
}

setTimeout(()=>{
  findMissedEvents().catch((err)=>{
    console.log(err)
  })
}, 5000)


module.exports = {
  findEvent,
}
