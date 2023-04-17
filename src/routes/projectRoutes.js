const express = require('express');
const talkerFiles = require('../talker.json')

const route = express.Router();

app.get('/talker', async(req, res) => {
  const talks = await talkerFiles.getAll();
  return res.status(200).json(talks)
})

module.exports = route;