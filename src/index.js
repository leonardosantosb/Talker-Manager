const express = require('express');
const fs = require('fs').promises;
// const path = require('path');

const app = express();
app.use(express.json());

const readFile = async () => {
  const talker = await fs.readFile('src/talker.json', 'utf-8');
  return JSON.parse(talker);
};

// const writeFile = async (talkerArr) => {
//   await fs.writeFile('src/talker.json', JSON.stringify(talkerArr));
// };

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

const emailValidation = (req, res, next) => {
  const { email } = req.body;
  // const isValid = Object.values(talks).every((value) => value.length === 0);
  if (!email) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }
  next();
};
const emailFormat = (req, res, next) => {
  const { email } = req.body;
  const regex = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
  const RegexAprov = regex.test(email);
  if (!RegexAprov) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  next();
};

const passwordValidation = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({
      message: 'O campo "password" é obrigatório',
    });
  }
  next();
};

const passwordLength = (req, res, next) => {
  const { password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }
  next();
};

app.post('/login', emailValidation, emailFormat,
  passwordValidation, passwordLength, async (req, res) => {
  console.log(req);
  const token = Math.floor(Math.random() * 10000000000000000).toString();

  return res.status(200).json({ token });
});
