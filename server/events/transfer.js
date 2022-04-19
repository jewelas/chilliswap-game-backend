const { erc271Contract, marketContract } = require('../service/web3')

const {
  mint,
  listOnAuction,
  bid,
  claimNft,
  transfer,
} = require('../functions/token')



//const startListening = (erc271Contract,marketContract ) => {
  console.log("listening to events")

  erc271Contract.events.allEvents(function (error, event) {
    if (error) {
      console.log('error')
      console.log(error)
      return
    }
    console.log('==========================')
    console.log(event.event)
  
    switch (event.event) {
      case 'Mint':
        mint(event)
        break
      case 'Transfer':
        transfer(event)
        break
      default:
    }
  })
  
  marketContract.events.allEvents(function (error, event) {
    if (error) {
      console.log('error')
      console.log(error)
      return
    }
    console.log('==========================')
    console.log(event.event)
  
    switch (event.event) {
      case 'ListOnAuction':
        listOnAuction(event)
        break
      case 'Bid':
        bid(event)
        break
      case 'ClaimNft':
        claimNft(event)
        break
      case 'Transfer':
        transfer(event)
        break
      default:
    }
  })
//}




// module.exports = {
//   startListening,
// }


// ;(async () => {

//   let auction = await contract.methods.getAuction(1).call()
//   console.log(auction)
//   contract.getPastEvents('Transfer', {
//     filter: {tokenId: "1", }, // Using an array means OR: e.g. 20 or 23
//     fromBlock: 0,
//     toBlock: 'latest'
// }, function(error, events){ console.log(events); })
// .then(function(events){
//     console.log(events) // same results as the optional callback above
// });

// })()

// {
//     removed: false,
//     logIndex: 28,
//     transactionIndex: 35,
//     transactionHash: '0xe5e7bb707440bcf560de6bb51d71339ea4b9a50c8227faf130cc1eec7fe04d80',
//     blockHash: '0x6c3b7a761cdc048d1d3dcb4f03f5dfc82bc49370b77aead1b7943fffd97ccc88',
//     blockNumber: 9998349,
//     address: '0x6AEf5E198c76460db6e4330dD59155E72AFdc023',
//     id: 'log_00f3ad33',
//     returnValues: Result {
//       '0': '0x61F389D2B2FDd8C56120E1200202C38Cbf1Aee40',
//       '1': '0xA235745c20bFdc9af15ca015A6D1d5344dF94d4E',
//       '2': '6',
//       from: '0x61F389D2B2FDd8C56120E1200202C38Cbf1Aee40',
//       to: '0xA235745c20bFdc9af15ca015A6D1d5344dF94d4E',
//       tokenId: '6'
//     },
//     event: 'Transfer',
//     signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//     raw: {
//       data: '0x',
//       topics: [
//         '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//         '0x00000000000000000000000061f389d2b2fdd8c56120e1200202c38cbf1aee40',
//         '0x000000000000000000000000a235745c20bfdc9af15ca015a6d1d5344df94d4e',
//         '0x0000000000000000000000000000000000000000000000000000000000000006'
//       ]
//     }
//   }
