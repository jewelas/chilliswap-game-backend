module.exports = (validator) => {
    return (req, res, next) => {
      const { error } = validator(req.body)
    //   console.log('error: ', error)
      if (error) {
        return res.status(400).send(error.details[0].message)
      }
      next()
    }
  }