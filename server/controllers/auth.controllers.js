const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const  User  = require('../models/user')
const { config } = require('../config/jwt')



exports.login = async (req, res, ) => {
    try {

        const {signature, publicAddress } = req.body;
        let user = await User.findOne({ publicAddress: publicAddress.toLowerCase()})
        if (!user) {
          return res.status(400).send({ error: 'user not exist'});
        }
        const msg = `Please sign this message to connect to ${process.env.APP_NAME}(${user.nonce})`;

        // We now are in possession of msg, publicAddress and signature. We
        // will use a helper from eth-sig-util to extract the address from the signature
        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
        const address = recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });
        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
        // console.log(address.toLowerCase(), publicAddress.toLowerCase())
        if (address.toLowerCase() !== publicAddress.toLowerCase()) {
            return res.status(401).send({
                error: 'Signature verification failed',
            });
        }
        user.nonce = Math.floor(Math.random() * 1000000);
        user = await user.save();
        //TODO: add expire add and check in a middleware
        const payload = {
            id: user._id,
            publicAddress
        }
        const accessToken = await jwt.sign(payload, config.secret, { algorithm: config.algorithms[0], })
        if (!accessToken) {
            return new Error('Empty token');
        }
        return res.status(200).send({ accessToken })

    } catch (err) {
      return res.status(401).send(err);
    }
}

exports.register = async (req, res,) => {
  try {

      const { signature, publicAddress, email, password ,username } = req.body;
      
      let user = await User.findOne({ publicAddress: publicAddress.toLowerCase()})
      
      if (user && user.email !== email) {
        return res.status(400).send({ error: 'Email or Public Address Not Match' });
      }
      if (!user) {
        const emailIs = await User.findOne({email})
        if (emailIs) {
          return res.status(400).send({error: 'Email Already Exists'})
        }
        
        const usernameIs = await User.findOne({username})
        if (usernameIs) {
          return res.status(400).send({error: 'User Name Already Exists'})
        }

        const newUser = new User({
          nonce: Math.floor(Math.random() * 10000),
          publicAddress: publicAddress,
          email: email,
          username: username,
          password: bcrypt.hashSync(password, 8)
        })
          user = await newUser.save()
          

      } else {
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({ error: 'Invalid Password!' });
        }
      }

      const msg = `Please sign this message to connect to ${process.env.APP_NAME}(${user.nonce})`;
      // We now are in possession of msg, publicAddress and signature. We
      // will use a helper from eth-sig-util to extract the address from the signature
      const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
      const address = recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature,
      });
      // The signature verification is successful if the address found with
      // sigUtil.recoverPersonalSignature matches the initial publicAddress
      // console.log(address.toLowerCase(), publicAddress.toLowerCase())
      if (address.toLowerCase() !== publicAddress.toLowerCase()) {
          return res.status(401).send({
              error: 'Signature verification failed',
          });
      }
      user.nonce = Math.floor(Math.random() * 10000);
      user = await user.save();

      //TODO: add expire add and check in a middleware
      const payload = {
          id: user._id,
          publicAddress
      }

      const accessToken = await jwt.sign(payload, config.secret, { algorithm: config.algorithms[0], })
      if (!accessToken) {
          return new Error('Empty token');
      }
      return res.status(200).send({ accessToken })

  } catch (err) {
      return res.status(401).send(err);
  }
}