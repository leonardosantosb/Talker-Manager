const fs = require('fs').promises;
const express = require('express');
const { ageValidation } = require('./middleware/ageValidation');
const { emailValidation, emailFormat } = require('./middleware/emailValidation');
const { nameValidation } = require('./middleware/nameValidation');
const { passwordValidation, passwordLength } = require('./middleware/passwordValidation');
const { rateValidation } = require('./middleware/rateValidation');
const { talkValidation } = require('./middleware/talkValidation');
const { tokenValidation } = require('./middleware/tokenValidation');

// const path = require('path');

const app = express();
app.use(express.json());

const readFile = async () => {
  const talker = await fs.readFile('src/talker.json', 'utf-8');
  return JSON.parse(talker);
};

const writeFile = async (talkerArr) => {
  await fs.writeFile('src/talker.json', JSON.stringify(talkerArr));
};

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talks = await readFile();
  return res.status(200).json(talks);
});

app.get('/talker/:id', async (req, res) => {
  const talks = await readFile();
  const talkFound = talks.find((talkId) => talkId.id === Number(req.params.id));
  if (talkFound) { return res.status(200).json(talkFound); }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', emailValidation, emailFormat,
  passwordValidation, passwordLength, async (req, res) => {
  const token = Math.floor(
    (Math.random() * (9999999999999999 - 1000000000000000) + 1000000000000000),
)
    .toString();
  return res.status(200).json({
    token,
  });
});

app.post('/talker', tokenValidation, nameValidation,
ageValidation, talkValidation, rateValidation, async (req, res) => {
  const talks = await readFile();
  const talksSoma = { id: talks.length + 1, ...req.body };
  talks.push(talksSoma);
  await writeFile(talks);

  return res.status(201).json(talksSoma);
  });
