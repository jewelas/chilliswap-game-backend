const Web3 = require('web3')

const User = require('../models/user')
const VerifyModal = require('../models/verify')

const {UploadImage} = require('../functions/image')
const {getExtension} = require('../functions/char')
const { getImageFromIpfs,getMetadataFromIpfs } = require('../functions/ipfs')



//  find the user and if not create one. do that in one route
exports.getUser = async (req, res, next) => {
  try {
    const publicAddress = req.params.publicAddress.toLowerCase()
    console.log(publicAddress)
    let user = await User.findOne({ publicAddress: publicAddress })
    if (!user) {
      const newUser = new User({
        nonce: Math.floor(Math.random() * 10000),
        publicAddress: publicAddress,
        username: '', // later make a uniquie name
        role: 'user',
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
    if (req.user.payload.id !== req.params.userId) {
      return res.status(401).send({ error: 'You can can only access yourself' })
    }
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(401).send({ error: 'user not found' })
    }
    return res.json(user)
  } catch (err) {
    console.log(err)
    next()
  }
}

exports.patch = async (req, res) => {
  try {
    const user = await User.findById(req.user.payload.id)

    if (!user) {
      return res.status(401).send({ error: 'invalid id' })
    }

    const {
      username,
      email,
      fullname,
      bio,
      mobile,
      coverImg,
      avatar,
      instagram,
      facebook,
      youtube,
      tiktok,
    } = req.body

    if(username == "" || fullname == "" || email == ""){
      throw new Error("fill the fields")
    }

    if (user.username != username) {
      const doesUserExit = await User.exists({ username: username })
      if (doesUserExit) {
        return res.status(401).send({
          error: 'Username Taken',
        })
      }
    }
    // one time only
    if(user.username == ""){
      user.username = username
    }


    if(user.avatar !== avatar){
      let path = `creator/${user.username}/${avatar}`

      let imageData = await getImageFromIpfs(avatar)
      let responseUpload = await UploadImage(imageData, path)
      user.avatar = responseUpload.Key

    }
    
    if(user.coverImg !== coverImg){
      let path = `creator/${user.username}/${coverImg}`

      let imageData = await getImageFromIpfs(coverImg)
      let responseUpload = await UploadImage(imageData, path)
      user.coverImg = responseUpload.Key

    }
   

    // user.coverImg = coverImg
    // user.avatar = avatar

    user.fullname = fullname
    user.email = email
    user.bio = bio
    user.mobile = mobile
    user.instagram = instagram
    user.facebook = facebook
    user.youtube = youtube
    user.tiktok = tiktok
    // if(user.username !== '') {
    //   user.role= "creator"
    // }
    let savedUser = await user.save()
    return res.status(200).send(savedUser)
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }
}

exports.verifyTwiiter = async (req, res) => {
  try {
    const user = await User.findById(req.user.payload.id)

    if (!user) {
      return res.status(401).send({ error: 'invalid id' })
    }

    const { publicAddress, username, twitter } = req.body

    const foundVerifyUser = await VerifyModal.findOne({
      publicAddress: publicAddress.toLowerCase(),
    })
    if (foundVerifyUser) {
      foundVerifyUser.twitter = twitter
      foundVerifyUser.username = username
      foundVerifyUser.status = "pending"
      let savedVerifyUser = await foundVerifyUser.save()
      return res.status(200).send(savedVerifyUser)
    }

    let newVerifyUser = new VerifyModal({
      publicAddress: publicAddress.toLowerCase(),
      username: username,
      twitter: twitter,
    })

    let createdVerifyUser = await newVerifyUser.save()
    return res.status(200).send(createdVerifyUser) 
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }
}

exports.followCreator = async (req, res) => {
  try {
    const user = await User.findById(req.user.payload.id)

    if (!user) {
      return res.status(401).send({ error: 'invalid id' })
    }

    let followCreator = req.body.creator

    const creator = await User.findOne({publicAddress: followCreator})
    if(!creator){
      return res.status(400).send({message: "no creator found"})
    }

    let following = user.following
    let followers  =  creator.followers

    let isFollowing = false
    //check if following
    following.forEach((_creator)=>{
      if(_creator === followCreator){
        isFollowing = true
      }
    })

    if(isFollowing){
      following = following.filter((_creator)=> _creator !== followCreator)
      followers = followers.filter((_follower)=> _follower !== user.publicAddress)
    }else{
      following.push(followCreator)
      followers.push(user.publicAddress)
    }


    user.following = following
    user.markModified("following")

    creator.followers = followers
    creator.markModified("followers")

    await creator.save()
    await user.save()
    
    return res.status(200).send({creator, user})

  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }

}
//  TODO: use this instead
// const i = creators.findIndex(_creator => _creator.publicAddress === creator.publicAddress);
// if (i > -1) creators[i] = creator; 
// else creators.push(creator);


// exports.beCreators = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.payload.id)
//     user.role= 'creator'
//     await user.save()

//     return res.status(200).send(user)

//   } catch (err) {
//     console.log(err)
//     return res.status(500).send({
//       error: `Internal Error`,
//     })
//   }
// }

exports.getCreators = async (req, res) => {
  try {
    const creator = await User.find({ role: 'creator' }) // add a role
    return res.status(200).send(creator)
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }
}

exports.getByUsername = async (req, res) => {
  try {
    let username = req.body.username
    let searchBy = 'username'
    if (Web3.utils.isAddress(username)) {
      searchBy = 'publicAddress'
    }
    const user = await User.findOne({ [searchBy]: username })

    if (!user) {
      return res.status(400).send({ message: 'no user found' })
    }
    return res.status(200).send(user)
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }
}

exports.searchCreatorByString = async (req, res) => {
  try {
    let searchQuery = req.body.search
    if(searchQuery == undefined || searchQuery == null){
      searchQuery = ""
    }
    if(searchQuery.length > 0){
      searchQuery = searchQuery.trim()

    }
    if(searchQuery === ""){
      let foundCreators = await User.find({role: 'creator' })  
      return res.status(200).send(foundCreators)
    }

    let foundCreators = await User.find({
        role: 'creator',
        $or: [
          { username: { $regex: searchQuery, $options: 'i' } },
          { fullname: { $regex: searchQuery, $options: 'i' } },
          { publicAddress: { $regex: searchQuery, $options: 'i' } },
        ],
    })  
    return res.status(200).send(foundCreators)
  
    
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}


// exports.syncCreator = (req, res)=> {
//   try{

    

//   }catch(err){
//     console.log(err)
//     return res.status(500).send(err)
//   }


// }