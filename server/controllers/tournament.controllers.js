const tournament = require('../models/tournament')

exports.create = async (req, res) => {
  try {
    const { start_date, end_date, tournament_name, duration, timestamp  } = req.body
    const newtournament = new tournament({
      start_date: start_date,
      end_date: end_date,
      tournament_name: tournament_name,
      duration: duration,
      timestamp: timestamp
    })
    await newtournament.save()
    res.send({status: "success"})

  } catch (error) {
    return res.status(401).send(error.message);
  }
}

exports.findOne = async(req, res) => {
    try {
      const _id = req.params.id
      const data =  await tournament.findById(_id)
      return res.send(data)
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }
  exports.update = async(req, res) => {
    try {
      const _id = req.params.id
      const data =  await tournament.findByIdAndUpdate(_id,req.body)
      if (data) {
        res.send({ status: 'success'})
      } else {
        res.status(400).send({ status: 'false' })
      }
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }

exports.findAll = async(req, res) => {
  try {
    const data =  await tournament.find()
    const currentDate = new Date();
    return res.send({currentDate, data})
  } catch (error) {
    return res.status(401).send(error.message);
  }
}
exports.delete = async(req, res) => {
  try {
    const _id = req.params.id
    const data =  await tournament.findByIdAndRemove(_id)
    if (data) {
      res.send({ status: 'success'})
    } else {
      res.status(400).send({ status: 'false'})
    }
  } catch (error) {
    return res.status(401).send(error.message);
  }
}

exports.joined = async(req, res) => {
  try {
    const walletAddress = req.user.publicAddress;
    const data = await tournament.find({players: walletAddress});
    return res.json({
      joinedTournaments: data
    })
  } catch (error) {
    return res.status(401).send(error.message);
  }
}

exports.notJoined = async(req, res) => {
  try {
    const walletAddress = req.user.publicAddress;
    const data = await tournament.find({"players": { "$ne": walletAddress }});
    return res.json({
      notJoinedTournaments: data
    })
  } catch (error) {
    return res.status(401).send(error.message);
  }
}

exports.join = async(req, res) => {
  try {
    const { tournamentId } = req.body
    const walletAddress = req.user.publicAddress;
    const tour = await tournament.findById( tournamentId );
    const index = tour.players.indexOf(walletAddress);
    if (index >= 0) {
      return res.status(401).send({
        error: 'Already joined',
      })
    }else{
      const players = tour.players;
      players.push(walletAddress);
      await tournament.findByIdAndUpdate(tournamentId, {players: players});
      res.send({status: "success"});
    }
  } catch (error) {
    return res.status(401).send(error.message);
  }
}