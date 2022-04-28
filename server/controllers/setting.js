const Setting = require('../models/setting')
 

exports.getCategory = async (req, res) => {
    try {
  
      const setting = await Setting.findOne({})
  
      return res.status(200).send({category: setting.category})
    } catch (err) {
      return res.status(500).send(err)
    }
  }
  