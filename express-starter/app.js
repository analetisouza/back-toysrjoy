'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Routes
app.post('/*', (req, res) => {

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hereanagoes@gmail.com',
      pass: 'bgenirvapnilqgct',
    }
  });
  
  const mailOptions = {
    from: '"ToysRJoy Minions Collection" <hereanagoes@gmail.com>',
    to: `${JSON.stringify(req.body['email'])} , analeticiarsouza@gmail.com`,
    subject: 'Reserva efetuada',
    text: `Dados da reserva: \n
           Nome: ${JSON.stringify(req.body['nome'])} \n
           E-mail: ${JSON.stringify(req.body['email'])} \n
           CPF: ${JSON.stringify(req.body['cpf'])} \n
           Possui diploma universitário: ${JSON.stringify(req.body['diploma'])} \n
           Produto: ${JSON.stringify(req.body['produto'])}`
  };
  
  transport.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send(`Request received: ${req.method} - ${req.path} - ${mailOptions.text}`);
    }
  });
});

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

module.exports = app;
