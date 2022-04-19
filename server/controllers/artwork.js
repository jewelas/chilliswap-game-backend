const web3 = require('web3')
const User = require('../models/user')
const Artwork = require('../models/artwork')
const Transaction = require('../models/transaction')

const { findEvent } = require('../events/find')
const { getAuction } = require('../functions/auction')
const { getImageFromIpfs,getMetadataFromIpfs } = require('../functions/ipfs')
const { UploadImage } = require('../functions/image')
const { makeUrl } = require('../functions/char')

// const { syncArtwork } = require('../functions/artwork')


exports.syncAuction = async (req, res) => {
  try {
    console.log('SYNCING...')

    const { tokenId } = req.body

    if (isNaN(parseInt(tokenId))) {
      return res.status(400).send({ message: 'invalid tokenId' })
    }
    let artwork = await Artwork.findOne({ tokenId: tokenId })

    if (!artwork) {
      // TODO : find by ID in the events
      await findEvent('Mint')
      artwork = await Artwork.findOne({ tokenId: tokenId })
      if (!artwork) {
        throw new Error('artwork has not found')
      }
    }
    if (artwork.image == undefined || !artwork.image || artwork.image == '') {
      let imageData = await getImageFromIpfs(artwork.artwork)
      let responseUpload = await UploadImage(imageData, artwork.artwork)
      artwork.image = responseUpload.Location
    }

    if (!artwork.title || !artwork.description) {
      let metadata = await getMetadataFromIpfs(artwork.metadata)
      console.log(metadata)
      artwork.title = metadata.title
      artwork.description = metadata.description
      artwork.category = metadata.category

      let url = makeUrl(metadata.title)
      let randomNumber = Math.floor(Math.random() * 100000) + 1
      artwork.url = url + randomNumber

      console.log('SYNCED META DATA')
    }

    let auction = await getAuction(tokenId)
    auction.owner = auction.owner.toLowerCase()
    auction.seller = auction.seller.toLowerCase()

    if (auction.active !== artwork.isAuction) {
      await findEvent('ListOnAuction')
      await findEvent('ClaimNft')
      console.log('SYNC: FIND ACTIVE')
    }

    if (auction.active) {
      let biddersLength = artwork.bidders.length
      if (artwork.price != auction.value) {
        await findEvent('Bid')
        console.log('SYNC: FIND VALUE')
      } else if (biddersLength > 0 && artwork.owner !== auction.owner) {
        await findEvent('Bid')
        console.log('SYNC: FIND OWNER')
      }

      artwork.currency = auction.currency == 0 ? 'ETH' : 'KOKO'
      artwork.endTime = auction.endTime
    }

    let updatedArtwork = await artwork.save()

   // console.log('SAVED..')
    return res.status(200).send(updatedArtwork)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getUserCreations = async (req, res) => {
  try {
    let searchBy = 'username'
    let user = req.params.user

    if (web3.utils.isAddress(user)) {
      searchBy = 'creator'
    }

    let artworks = await Artwork.find({ [searchBy]: user })
    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getUserCollections = async (req, res) => {
  try {
    let user = req.params.user
    let artworks = await Artwork.find({
      owner: user,
      isAuction: false,
      creator: { $ne: user },
    })
    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getMyArtworks = async (req, res) => {
  try {
    const user = await User.findById(req.user.payload.id)
    if (!user) {
      return res.status(400).send({ message: 'unauthorized' })
    }

    let artworks = await Artwork.find({ username: user.username })

    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getMyBids = async (req, res) => {
  try {
    const user = await User.findById(req.user.payload.id)
    if (!user) {
      return res.status(400).send({ message: 'unauthorized' })
    }

    let artworks = await Artwork.find({
      'bidders.bidder': user.publicAddress,
      isAuction: true,
    })

    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getArtworkTransaction = async (req, res) => {
  try {
    const tokenId = parseInt(req.params.tokenId)
    const transactions = await Transaction.find({ tokenId: tokenId }).sort({
      date: -1,
    })
    return res.status(200).send(transactions)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getArtworks = async (req, res) => {
  try {
    let liveArtworks = await Artwork.find({ isAuction: true }).sort({
      endTime: -1,
    })
    let soldArtworks = await Artwork.find({ isAuction: false }).sort({
      endTime: -1,
    })
    let artworks = liveArtworks.concat(soldArtworks)
    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}
exports.getArtwork = async (req, res) => {
  try {
    let tokenId = req.params.tokenId
    let searchBy = 'tokenId'
    if (isNaN(parseInt(tokenId))) {
      searchBy = 'url'
    }

    let artwork = await Artwork.findOne({ [searchBy]: tokenId })

    if (!artwork) {
      findEvent('Mint')
      return res.status(400).send({ message: 'artwork not found' })
    }
    return res.status(200).send(artwork)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.searchByString = async (req, res) => {
  try {
    let searchQuery = req.params.search
    const LIMIT = 5

    const foundArtworks = await Artwork.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { tokenId: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } },
      ],
    }).limit(LIMIT)

    const foundCreators = await User.find({
      role: 'creator',
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { fullname: { $regex: searchQuery, $options: 'i' } },
      ],
    }).limit(LIMIT)

    const data = {
      artworks: foundArtworks,
      creators: foundCreators,
    }

    return res.status(200).send(data)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

// (async()=>{
//   try{
//     let artworks = await Artwork.find({isAuction: true}).sort({endTime: 1})
//     console.log(artworks)
//     res.status(200).send(artworks)
//   }catch(err){
//     res.status(500).send(err)
//   }
// })()

exports.getLiveArtworks = async (req, res) => {
  try {
    let artworks = await Artwork.find({ isAuction: true }).sort({ endTime: -1 })
    res.status(200).send(artworks)
  } catch (err) {
    res.status(500).send(err)
  }
}
exports.getSoldArtworks = async (req, res) => {
  try {
    let artworks = await Artwork.find({ isAuction: false }).sort({
      endTime: -1,
    })
    res.status(200).send(artworks)
  } catch (err) {
    res.status(500).send(err)
  }
}

// exports.mintArtwork = async (req, res) => {
//   try {
//     const event = {

//     }
//     mint(event)
//   } catch (err) {
//     console.log(err)
//   }
// }
