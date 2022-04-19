const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const jwt = require('jsonwebtoken');

const User = require('../models/user')
const { config } = require('../config/jwt')

exports.create = async (req, res, next) => {
    try {

        const { signature, publicAddress } = req.body;
        if (!signature || !publicAddress)
            return res.status(400).send({ error: 'Request should have signature and publicAddress' });


        let user = await User.findOne({ publicAddress: publicAddress.toLowerCase() })
        if (!user) {
            return res.status(401).send({
                error: `User with publicAddress ${publicAddress} is not found in database`,
            });
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
        console.log(address.toLowerCase(), publicAddress.toLowerCase())
        if (address.toLowerCase() !== publicAddress.toLowerCase()) {
            return res.status(401).send({
                error: 'Signature verification failed',
            });
        }
        user.nonce = Math.floor(Math.random() * 10000);
        user = await user.save();

        //TODO: add expire add and check in a middleware
        let payload = {
            id: user._id,
            publicAddress
        }

        let accessToken = await jwt.sign({ payload: payload, }, config.secret, { algorithm: config.algorithms[0], })
        if (!accessToken) {
            return new Error('Empty token');
        }
        return res.status(200).send({ accessToken })

    } catch (err) {
        return res.status(401).send(err);
    }


}