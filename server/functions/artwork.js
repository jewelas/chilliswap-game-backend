const { getAuction } = require('../functions/auction')
const { makeUrl } = require('../functions/char')
const { UploadImage } = require('../functions/image')
const { getImageFromIpfs,getMetadataFromIpfs } = require('./ipfs')

const Artwork = require('../models/artwork')


// const syncArtwork = (tokenId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let artwork = await Artwork.findOne({ tokenId: tokenId })

//       if (!artwork) {
//           // TODO : find by ID in the events
//         await findEvent("Mint")
//          artwork = await Artwork.findOne({ tokenId: tokenId })
//         if(!artwork){
//             throw new Error('artwork has not found')
//         }
//       }
//       if (artwork.image == undefined || !artwork.image || artwork.image == '') {
//         let imageData = await getImageFromIpfs(artwork.artwork)
//         let responseUpload = await UploadImage(imageData, artwork.artwork)
//         artwork.image = responseUpload.Location
//       }

//       if (!artwork.title || !artwork.description) {
//           let metadata = await getMetadataFromIpfs(artwork.metadata)
//           console.log(metadata)
//           artwork.title = metadata.title
//           artwork.description = metadata.description
//           artwork.category = metadata.category

//           let url = makeUrl(metadata.title)
//           let randomNumber = Math.floor(Math.random() * 100000) + 1
//           artwork.url = url + randomNumber

//           console.log('SYNCED META DATA')
        
//       }

//       let auction = await getAuction(tokenId)
//       auction.owner = auction.owner.toLowerCase()
//       auction.seller = auction.seller.toLowerCase()

//       if (auction.active !== artwork.isAuction) {
//         await findEvent('ListOnAuction')
//         await findEvent('ClaimNft')
//         console.log('SYNC: FIND ACTIVE')
//       }
//       console.log(artwork)
//       console.log(auction)
//       if (auction.active) {
//         let biddersLength = artwork.bidders.length
//         if (artwork.price != auction.value) {
//           await findEvent('Bid')
//           console.log('SYNC: FIND VALUE')
//         } else if (biddersLength > 0 && artwork.owner !== auction.owner) {
//           await findEvent('Bid')
//           console.log('SYNC: FIND OWNER')
//         }

//         artwork.currency = auction.currency == 0 ? 'ETH' : 'CSWP'
//         artwork.endTime = auction.endTime
//       }

//       let updatedArtwork = await artwork.save()
//       resolve(updatedArtwork)
//     } catch (err) {
//         reject(err)
//     }
//   })
// }

const basicSyncArtwork = (tokenId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let artwork = await Artwork.findOne({ tokenId: tokenId })
  
        if (!artwork) {
            throw new Error('artwork has not found')
        }
        if (artwork.image == undefined || !artwork.image || artwork.image == '') {
          let imageData = await getImageFromIpfs(artwork.artwork)
          let responseUpload = await UploadImage(imageData, artwork.artwork)
          artwork.image = responseUpload.Location
        }
  
        if (!artwork.title || !artwork.description) {
            let metadata = await getMetadataFromIpfs(artwork.metadata)
            artwork.title = metadata.title
            artwork.description = metadata.description
            artwork.category = metadata.category
  
            let url = makeUrl(metadata.title)
            let randomNumber = Math.floor(Math.random() * 100000) + 1
            artwork.url = url + randomNumber
  
            console.log('SYNCED META DATA')
          
        }
  
        let updatedArtwork = await artwork.save()
        resolve(updatedArtwork)
      } catch (err) {
          reject(err)
      }
    })
  }
  


module.exports = {
    basicSyncArtwork
}