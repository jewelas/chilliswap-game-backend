const User = require("../models/user");
const Character = require("../models/character");
const bcrypt = require("bcryptjs");
const WAValidator = require("public-address-validator");
const { BigNumber } = require("ethers");
const { chilliNftContract, chilliswapEthContract, chilliswapPolygonContract, chilliswapRinkebyContract, chilliswapMumbaiContract, ethWeb3, polygonWeb3, rinkebyWeb3, mumbaiWeb3 } = require("../service/web3");

const chilliEthContract = process.env.STATUS == "dev" ? chilliswapRinkebyContract : chilliswapEthContract;
const chilliPolygonContract = process.env.STATUS == "dev" ? chilliswapMumbaiContract : chilliswapPolygonContract;

const web3ETH = process.env.STATUS == "dev" ? rinkebyWeb3 : ethWeb3;
const web3Polygon = process.env.STATUS == "dev" ? mumbaiWeb3 : polygonWeb3;

exports.getUser = async (req, res) => {
  try {
    const publicAddress = req.params.publicAddress.toLowerCase();
    if (publicAddress === "") {
      return res.status(400).send({ error: "Public Address is required" });
    }

    const valid = WAValidator.validate(publicAddress, "ETH");
    if (!valid) {
      return res.status(400).send({ error: "Enter valid Public Address " });
    }

    let user = await User.findOne({ publicAddress: publicAddress });
    if (!user) {
      const newUser = new User({
        nonce: Math.floor(Math.random() * 1000000),
        publicAddress: publicAddress,
        username: "", // later make a uniquie name
        // email: '', // later make a uniquie name
      });
      user = await newUser.save();
    }
    return res.json({
      nonce: user.nonce,
      publicAddress: user.publicAddress,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Error" });
  }
};

exports.get = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).send({ error: "invalid user" });
    }
    res.send({ publicAddress: user.publicAddress });
  } catch (err) {
    console.log(err);
    next();
  }
};

exports.patch = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).send({ error: "invalid user" });
    }
    const { email, username, publicAddress } = req.body;

    if (user.username !== username) {
      const doesUserExit = await User.exists({ username: username });
      if (doesUserExit) {
        return res.status(401).send({
          error: "Username Taken",
        });
      }
    }
    if (user.email !== email) {
      const doesemailExit = await User.exists({ email: email });
      if (doesemailExit) {
        return res.status(401).send({
          error: "Email already  Taken",
        });
      }
    }
    if (user.publicAddress !== publicAddress) {
      const doespublicAddressExit = await User.exists({ publicAddress: publicAddress });
      if (doespublicAddressExit) {
        return res.status(401).send({
          error: "public Address already  Taken",
        });
      }
    }

    user.username = username;
    user.email = email;
    user.publicAddress = publicAddress;

    const savedUser = await user.save();
    return res.status(200).send({ publicAddress: savedUser.publicAddress, email: savedUser.email, username: savedUser.username });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: `Internal Error`,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { oldpassword, newpassword } = req.body;

    if (!oldpassword) {
      return res.status(400).send({ error: "old password is required" });
    }
    if (!newpassword) {
      return res.status(400).send({ error: "New password is required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).send({ error: "invalid user" });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "password not match!",
      });
    }
    const newpass = bcrypt.hashSync(newpassword, 8);
    await user.save({ password: newpass });
  } catch (err) {
    console.log(err);
    next();
  }
};

exports.getswapchillies = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user.id });
    if (!user) {
      return res.status(401).send({ error: "invalid user" });
    }
    res.send({ status: "success", data: { token_amount: user.token_amount } });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const walletAddress = req.user.publicAddress;
    const doespublicAddressExit = await User.exists({ publicAddress: walletAddress.toString() });
    if (!doespublicAddressExit) {
      return res.status(401).send({ error: "invalid user" });
    }
    const balance = await chilliNftContract.methods.balanceOf(walletAddress).call();
    const chilliswapTokenBalancePolygon = await chilliPolygonContract.methods.balanceOf(walletAddress).call();
    const chilliswapTokenBalanceEth = await chilliEthContract.methods.balanceOf(walletAddress).call();
    const decimalPolygon = await chilliPolygonContract.methods.decimals().call();
    const decimalEth = await chilliEthContract.methods.decimals().call();
    const tokenAmount = parseFloat(chilliswapTokenBalancePolygon) / parseFloat("1e" + decimalPolygon) + parseFloat(chilliswapTokenBalanceEth) / parseFloat("1e" + decimalEth);
    const tokenIds = [];
    const tokenURIs = [];
    for (var i = 1; i <= balance; i++) {
      const tokenId = await chilliNftContract.methods.getTokenId(walletAddress, i).call();
      const tokenURI = await chilliNftContract.methods.tokenURI(tokenId).call();
      tokenIds.push(tokenId);
      tokenURIs.push(tokenURI);
    }
    await User.findOneAndUpdate({ publicAddress: walletAddress.toString() }, { tokenIds: tokenIds, tokenURIs: tokenURIs, token_amount: tokenAmount });
    const user = await User.findOne({ publicAddress: walletAddress.toString() });

    const character = await Character.findOne({ userAddress: user.publicAddress });
    const defaultCharacter = [
      {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "boy",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      },
      {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "boy",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      }, {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "boy",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      }, {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "girl",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      },
      {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "girl",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      }, {
        clothes: [
        ],
        accessories: [
        ],
        bodytype: "girl",
        skintone: "",
        hairstyle: "",
        eyecolor: "",
        updatedAt: "",
        createdAt: "",
        goggles: "",
        headphones: "",
        backpack: "",
        watch: "",
        shoes: "",
        headwear: ""
      }
    ]

    return res.json({
      nftTokenIds: tokenIds,
      ChilliTokenAmount: tokenAmount,
      coversionRate: parseFloat(process.env.CONVERSION_RATE),
      minChilliConvert: parseInt(process.env.MIN_CHILLI_CONVERT),
      CollectedChillis: user.chillis,
      ConfiguredCharacters: character ?? defaultCharacter,
    });
  } catch (error) {
    res.status(401).send({ error: "get profile failed!" });
  }
};

exports.chilliToToken = async (req, res) => {
  try {
    const user = await User.findOne({ publicAddress: req.user.publicAddress });
    console.log("user", req.user);

    let contract;
    let web3;
    const network = process.env.NETWORK;
    if (network == "Polygon") {
      contract = chilliPolygonContract;
      web3 = web3Polygon;
    } else {
      contract = chilliEthContract;
      web3 = web3ETH;
    }

    const minChilliConvert = parseInt(process.env.MIN_CHILLI_CONVERT);

    if (user.chillis >= minChilliConvert) {
      const tokenAmount = parseFloat(user.chillis * process.env.CONVERSION_RATE).toFixed(3);
      const decimal = await contract.methods.decimals().call();
      const query = contract.methods.transfer(user.publicAddress, BigNumber.from(parseFloat("1e" + decimal).toString()).mul(BigNumber.from(tokenAmount * 1000)).div(1000));
      const encodedABI = query.encodeABI();
      const signedTransaction = await web3.eth.accounts.signTransaction(
        {
          data: encodedABI,
          from: process.env.PUBLIC_KEY,
          gas: 2000000,
          to: contract.options.address,
        },
        process.env.PRIVATE_KEY
      );
      web3.eth
        .sendSignedTransaction(signedTransaction.rawTransaction)
        .on("receipt", async (receipt) => {
          console.log(" transfer success:  " + receipt.blockHash);
          await User.findOneAndUpdate({ publicAddress: req.user.publicAddress }, { chillis: 0 });
          res.send({ data: { tokenAmount } });
        })
        .on("error", function (err) {
          console.log(err);
          console.log("tx failed!");
          res.send({ status: "tx failed." });
        });
    } else {
      res.send({ status: "collected chillis not enough" });
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
};
