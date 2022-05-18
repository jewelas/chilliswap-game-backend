const User = require('../models/user')
const Character = require('../models/character')
const bcrypt = require("bcryptjs");
const WAValidator = require('public-address-validator');
const {chilliNftContract, chilliswapEthContract, chilliswapPolygonContract} = require("../service/web3");

exports.getUser = async (req, res,) => {
  try {
    const publicAddress = req.params.publicAddress.toLowerCase()
    if (publicAddress === "") {
      return res.status(400).send({ error: 'Public Address is required' });
    }

    const valid = WAValidator.validate(publicAddress, 'ETH');
    if (!valid) {
      return res.status(400).send({ error: 'Enter valid Public Address ' })
    }

    let user = await User.findOne({ publicAddress: publicAddress })
    if (!user) {
      const newUser = new User({
        nonce: Math.floor(Math.random() * 1000000),
        publicAddress: publicAddress,
        username: '', // later make a uniquie name
        // email: '', // later make a uniquie name

      })
      user = await newUser.save()
    }
    return res.json({
      nonce: user.nonce,
      publicAddress: user.publicAddress,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Error' })
  }
}

exports.get = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(401).send({ error: 'invalid user' })
    }
    res.send({ publicAddress: user.publicAddress })
  } catch (err) {
    console.log(err)
    next()
  }
}

exports.patch = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(401).send({ error: 'invalid user' })
    }
    const {
      email,
      username,
      publicAddress
    } = req.body

    if (user.username !== username) {
      const doesUserExit = await User.exists({ username: username })
      if (doesUserExit) {
        return res.status(401).send({
          error: 'Username Taken',
        })
      }
    }
    if (user.email !== email) {
      const doesemailExit = await User.exists({ email: email })
      if (doesemailExit) {
        return res.status(401).send({
          error: 'Email already  Taken',
        })
      }
    }
    if (user.publicAddress !== publicAddress) {
      const doespublicAddressExit = await User.exists({ publicAddress: publicAddress })
      if (doespublicAddressExit) {
        return res.status(401).send({
          error: 'public Address already  Taken',
        })
      }
    }

    user.username = username
    user.email = email
    user.publicAddress = publicAddress

    const savedUser = await user.save()
    return res.status(200).send({ publicAddress: savedUser.publicAddress, email: savedUser.email, username: savedUser.username })
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const { oldpassword, newpassword } = req.body

    if (!oldpassword) {
      return res.status(400).send({ error: 'old password is required' });
    }
    if (!newpassword) {
      return res.status(400).send({ error: 'New password is required' });
    }
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(401).send({ error: 'invalid user' })
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "password not match!"
      });
    }
    const newpass = bcrypt.hashSync(newpassword, 8)
    await user.save({ password: newpass })

  } catch (err) {
    console.log(err)
    next()
  }
}

exports.getswapchillies = async (req, res,) => {
  try {
    const user = await User.findById({ _id: req.user.id })
    if (!user) {
      return res.status(401).send({ error: 'invalid user' })
    }
    res.send({ status: "success", data: { token_amount: user.token_amount } })

  } catch (error) {
    res.status(401).send(error.message);
  }

}

exports.getProfile = async (req, res,) => {
  try {
    const walletAddress = req.user.publicAddress;
    const doespublicAddressExit = await User.exists({ publicAddress:  walletAddress.toString() })
    if(!doespublicAddressExit) {
      return res.status(401).send({ error: 'invalid user' })
    }
    const balance = await chilliNftContract.methods.balanceOf(walletAddress).call();
    const chilliswapTokenBalancePolygon = await chilliswapPolygonContract.methods.balanceOf(walletAddress).call();
    const chilliswapTokenBalanceEth = await chilliswapEthContract.methods.balanceOf(walletAddress).call();
    const tokenAmount = parseFloat(chilliswapTokenBalanceEth) + parseFloat(chilliswapTokenBalancePolygon);
    const tokenIds = [];
    const tokenURIs = [];
    for (var i = 1; i <= balance; i++){
      const tokenId = await chilliNftContract.methods.getTokenId(walletAddress, i).call();
      const tokenURI = await chilliNftContract.methods.tokenURI(tokenId).call();
      tokenIds.push(tokenId);
      tokenURIs.push(tokenURI);
    }
    await User.findOneAndUpdate({publicAddress: walletAddress.toString()}, {tokenIds: tokenIds, tokenURIs: tokenURIs, token_amount: tokenAmount});
    const user = await User.findOne({publicAddress: walletAddress.toString()});

    const character =  await Character.findOne({userAddress: user.publicAddress});

    return res.json({
      nftTokenIds:tokenIds,
      ChilliTokenAmount: tokenAmount,
      coversionRate: 1,
      UserName: user.username,
      CollectedChillis: user.chillis,
      ConfiguredCharacters: character
    })
  } catch (error) {
    res.status(401).send({ error: "get profile failed!" });
  }

}



