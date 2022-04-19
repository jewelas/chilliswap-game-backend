const fs = require('fs')
const fetch = require('node-fetch')
const Bluebird = require('bluebird')
fetch.Promise = Bluebird

const User = require('../models/user')
const Artwork = require('../models/artwork')
const Transaction = require('../models/transaction')

const { erc271Contract } = require('../service/web3')
const { basicSyncArtwork} = require('./artwork')

// ;(async () => {
//   // let artworks = await Artwork.find({})
//   // artworks.forEach((artwork)=>{
//   //   let url = makeUrl(artwork.title)
//   //   let randomNumber = Math.floor(Math.random() * 100000) + 1
//   //   artwork.url = url + '-' +randomNumber
//   //   artwork.save()
//   // })
//   // findArtworkAndSync()
//   // findMintedArtworks()
//   // findListedArtworks()

//  try{
//    let imageUrl = 'QmW64mQfimcFe47zuXTLUN34wAvnqYud3cRTpk8MDaX6JP/nft.jpg'
//   let imageData = await getImageFromIpfs(imageUrl)
//   console.log(typeof imageData)
//   console.log(imageData)
//   //const data = fs.readFileSync(imageData);

// //   let responseUplaod = await UploadImage(imageData,imageUrl)
// //   console.log(responseUplaod)
// //  }catch(err){
// //    console.log(err)
//  }
// //   console.log(typeof imageData)
// //   const data = fs.readFileSync('https://ipfs.io/ipfs/QmW64mQfimcFe47zuXTLUN34wAvnqYud3cRTpk8MDaX6JP/nft.jpg');

// //   console.log(data)


// })()

const mint = async (event) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { returnValues, removed, transactionHash } = event
      if (removed) {
        reject({ message: 'Mint Event: removed TX: ' + transactionHash })
        return
      }
      const { to, tokenId, artwork } = returnValues
      let foundedArtwork = await Artwork.findOne({ tokenId: tokenId })

      if (foundedArtwork) {
        reject({ message: 'ALREADY MINTED TOKEN ID: ' + tokenId })
        return
      }
      let foundedTransaction = await Transaction.findOne({
        hash: transactionHash,
      })
      if (foundedTransaction) {
        reject({ message: 'TRANSACTION HAS FOUND BUT NO ARTWORK' })
        return
      }

      let publicAddress = to.toLowerCase()
      let user = await User.findOne({ publicAddress })
      let metadataHash = await erc271Contract.methods.getArtwork(tokenId).call()

      const newArtwork = new Artwork({
        date: new Date(),
        username: user.username ? user.username : '',
        owner: publicAddress,
        creator: publicAddress,
        seller: publicAddress,
        artwork: artwork,
        metadata: metadataHash.metadata,
        tokenId: tokenId,
        title: null,
        description: null,
        status: 'Mint',
        url: tokenId,
      })
   

      const newTransaction = new Transaction({
        date: Date.now(),
        username: user.username ? user.username : '',
        type: 'Mint',
        tokenId: tokenId,
        value: 0,
        from: 0,
        to: publicAddress,
        hash: transactionHash,
      })

      let newlyMintedArtwork = await newArtwork.save()
      let newlyAddedTransaction = await newTransaction.save()

      //ALSO SET METADATA
       newlyMintedArtwork = await basicSyncArtwork(newlyMintedArtwork.tokenId)

      resolve({
        artwork: newlyMintedArtwork,
        transaction: newlyAddedTransaction,
      })

      return
    } catch (err) {
      reject(err)
      return
    }
  })
}

const listOnAuction = async (event) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { returnValues, removed, transactionHash } = event
      if (removed) {
        reject({
          message: 'ListOnAuction Event: removed TX: ' + transactionHash,
        })
        return
      }
      const {
        owner,
        tokenId,
        price,
        endTime,
        currency,
        auctionType,
      } = returnValues

      let artwork = await Artwork.findOne({ tokenId: tokenId })
      if (!artwork) {
        reject({ message: 'LISTED A ARTWORK NOT IN DATABASE' })
        return
      }
      let foundedTransaction = await Transaction.findOne({
        hash: transactionHash,
      })
      if (foundedTransaction) {
        reject({ message: 'LISTED TRANSACTION FOUND IN DATABASE TOKEN ID: '+ foundedTransaction.tokenId })
        return
      }

      artwork.isAuction = true
      artwork.seller = owner.toLowerCase()
      artwork.price = price
      artwork.currency = currency == '0' ? 'ETH' : 'KOKO'
      artwork.endTime = endTime
      artwork.status = 'Auction'

      let publicAddress = owner.toLowerCase()
      let user = await User.findOne({ publicAddress })

      const newTransaction = new Transaction({
        date: Date.now(),
        username: user.username ? user.username : '',
        type: 'ListOnAuction',
        tokenId: tokenId,
        value: price,
        from: publicAddress,
        to: 0,
        hash: transactionHash,
        currency: currency == '0' ? 'ETH' : 'KOKO',
      })

      let updateArtwork = await artwork.save()
      let newlyAddedTransaction = await newTransaction.save()
      resolve({ artwork: updateArtwork, transaction: newlyAddedTransaction })
      return
    } catch (err) {
      reject(err)
      return
    }
  })
}

const bid = async (event) => {
  return new Promise(async (resolve, reject) => {
    console.log("BIDDING LOG")
    try {
      const { returnValues, removed, transactionHash } = event
      if (removed) {
        reject({ message: 'Bid Event: removed TX: ' + transactionHash })
        return
      }
      let foundedTransaction = await Transaction.findOne({
        hash: transactionHash,
      })
      if (foundedTransaction) {
        reject({ message: 'BID TRANSACTION FOUND IN DATABASE TOKEN ID: '+ foundedTransaction.tokenId})
        return
      }

      const { tokenId, bidder, value } = returnValues

      let publicAddress = bidder.toLowerCase()
      let user = await User.findOne({ publicAddress })
      console.log("BidderId ", publicAddress)
      

      let artwork = await Artwork.findOne({ tokenId: tokenId })
      if (!artwork) {
        reject({ message: 'BIDDED A ARTWORK NOT IN DATABASE' })
        return
      }

      let newBider = {
        time: Date.now(),
        bidder: publicAddress,
        value: value,
      }

      const newTransaction = new Transaction({
        date: Date.now(),
        username: user.username ? user.username : '',
        type: 'Bid',
        tokenId: tokenId,
        value: value,
        from: publicAddress,
        to: 0,
        hash: transactionHash,
        currency: artwork.currency,
      })

      let bidders = artwork.bidders
      bidders.push(newBider)
      artwork.bidders = bidders
      artwork.price = value
      artwork.owner = publicAddress

      artwork.markModified('bidders')
      let newlyAddedTransaction = await newTransaction.save()
      let updateArtwork = await artwork.save()
      resolve({ artwork: updateArtwork, transaction: newlyAddedTransaction })

      // console.log(newlyAddedTransaction)
      return
    } catch (err) {
      reject(err)
      return
    }
  })
}

const claimNft = async (event) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { returnValues, removed, transactionHash } = event
      if (removed) {
        reject({ message: 'Claim Nft Event: removed TX: ' + transactionHash })
        return
      }
      let foundedTransaction = await Transaction.findOne({
        hash: transactionHash,
      })
      if (foundedTransaction) {
        reject({ message: 'CLAIM TRANSACTION FOUND IN DATABASE  TOKEN ID: '+ foundedTransaction.tokenId  })
        return
      }
      const { collector, tokenId, value } = returnValues

      let artwork = await Artwork.findOne({ tokenId: tokenId })

      if (!artwork) {
        reject({ message: 'CLAIM ARTWORK NOT IN DATABASE' })
        return
      }
      artwork.isAuction = false
      artwork.endTime = null
      artwork.status = 'Owned'

      const newTransaction = new Transaction({
        date: Date.now(),
        username: '',
        type: 'ClaimNft',
        tokenId: tokenId,
        value: 0,
        from: '0',
        to: collector.toLowerCase(),
        hash: transactionHash,
        currency: artwork.currency,
      })

      let updateArtwork = await artwork.save()
      let newlyAddedTransaction = await newTransaction.save()
      resolve({ artwork: updateArtwork, transaction: newlyAddedTransaction })
      return
    } catch (err) {
      reject(err)
      return
    }
  })
}

const transfer = async (event) => {
  //   const { blockNumber, returnValues, removed, transactionHash } = event
  //   if (removed) {
  //     console.log('Mint Event: removed TX: ' + transactionHash)
  //     return
  //   }
  //   const { from, to, tokenId } = returnValues

  //   let toAddress = to.toLowerCase()
  //   let fromAddress = from.toLowerCase()

  //   let artwork = await Artwork.findOne({ tokenId: tokenId })

  //   if (!artwork) {
  //     console.log("NO ARTWORK IN DATABASE")
  //     return
  // }

  //   let auction = await token.methods.getAuction(tokenId).call()
  //   let value = auction.value

  // // only if clam
  //   artwork.isAuction = false
  //   artwork.endTime = null

  //   const newTransaction = new Transaction({
  //     date: Date.now(),
  //     username: "",
  //     type: 'Transfer',
  //     tokenId: tokenId,
  //     value: 0,
  //     from: fromAddress,
  //     to: toAddress,
  //   })

  //   let newlyAddedTransaction = await newTransaction.save()
  return
}

// {
//   removed: false,
//   logIndex: 2,
//   transactionIndex: 3,
//   transactionHash: '0x90c18fda5c648f61931b0d5bfdaedf0fe5934c1ca06cf3052474a1c0cd1dbc26',
//   blockHash: '0x158f8681a0204000d7fa3096c3faf5f37973987e2ac1fef4551fd8a9ecdf33ff',
//   blockNumber: 10290686,
//   address: '0x9035B11fC763DEf237e897c2c42cd5df97D15b5B',
//   id: 'log_2508c52a',
//   returnValues: Result {
//     '0': '0x61F389D2B2FDd8C56120E1200202C38Cbf1Aee40',
//     '1': '4',
//     '2': 'QmW64mQfimcFe47zuXTLUN34wAvnqYud3cRTpk8MDaX6JP/nft.jpg',
//     to: '0x61F389D2B2FDd8C56120E1200202C38Cbf1Aee40',
//     tokenId: '4',
//     artwork: 'QmW64mQfimcFe47zuXTLUN34wAvnqYud3cRTpk8MDaX6JP/nft.jpg'
//   },
//   event: 'Mint',
//   signature: '0x85a66b9141978db9980f7e0ce3b468cebf4f7999f32b23091c5c03e798b1ba7a',
//   raw: {
//     data: '0x000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000036516d5736346d5166696d63466534377a7558544c554e33347741766e7159756433635254706b384d446158364a502f6e66742e6a706700000000000000000000',
//     topics: [
//       '0x85a66b9141978db9980f7e0ce3b468cebf4f7999f32b23091c5c03e798b1ba7a',
//       '0x00000000000000000000000061f389d2b2fdd8c56120e1200202c38cbf1aee40'
//     ]
//   }
// }

module.exports = {
  mint,
  listOnAuction,
  bid,
  claimNft,
  transfer,
}
