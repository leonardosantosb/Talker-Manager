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

module.exports = {
  emailValidation,
  emailFormat,
};