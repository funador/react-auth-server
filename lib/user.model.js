const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { providers } = require('../config')

const providerFields = providers.reduce((obj, provider) => {
  obj[provider] = {
    name: {
      type: String
    },
    photo: {
      type: String
    }
  }
  return obj
}, {})

// Data we need to collect/confirm to have the app go.
const fields = {
  email: {
    type: String,
    unique: true
  },
  ...providerFields
}

// One nice, clean line to create the Schema.
const userSchema = new Schema(fields)

module.exports = mongoose.model('User', userSchema)