const {chilliNftContract} = require("../service/web3");
const User = require('../models/user')

exports.getNftList = async (req, res,) => {
  try {
    console.log(req.body.walletAddress);
    const walletAddress = req.body.walletAddress;
    const balance = await chilliNftContract.methods.balanceOf(walletAddress).call();
    const tokenIds = [];
    const tokenURIs = [];
    for (var i = 1; i <= balance; i++){
      const tokenId = await chilliNftContract.methods.getTokenId(walletAddress, i).call();
      const tokenURI = await chilliNftContract.methods.tokenURI(tokenId).call();
      tokenIds.push(tokenId);
      tokenURIs.push(tokenURI);
    }
    const doespublicAddressExit = await User.exists({ publicAddress:  walletAddress.toString() })
    const user = await User.findOneAndUpdate({publicAddress: walletAddress.toString()}, {tokenIds: tokenIds});
    console.log("exist", doespublicAddressExit);
    console.log("updated user", user);
    console.log("tokenIds", tokenIds);
    console.log("tokenURIs", tokenURIs);
    return res.json({
      tokenURIs:tokenURIs
    })
  } catch (error) {
    console.log(error.message);
    res.status(401).send(error.message);
  }
}
  

