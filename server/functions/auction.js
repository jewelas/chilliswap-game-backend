const { erc271Contract,marketContract } = require('../service/web3')


exports.getAuction = (tokenId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let auction = await marketContract.methods.getAuction(tokenId).call()
      resolve(auction)
    } catch (err) {
      reject(err)
    }
  })
}

exports.getOwner = (tokenId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let auction = await erc271Contract.methods.getOwner(tokenId).call()
      resolve(auction)
    } catch (err) {
      reject(err)
    }
  })
}
