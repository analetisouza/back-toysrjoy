'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const data = require('./data.json');
const { setupMaster } = require('cluster');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Routes
app.post('/*', (req, res) => {

  data['idReserva']++;

  const leftZeros = function(num) {
    while(num.length < 4)
      num = "0" + num;
    return num;
  }

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hereanagoes@gmail.com',
      pass: '---',
    }
  });
  
  const mailOptions = {
    from: '"ToysRJoy Minions Collection" <hereanagoes@gmail.com>',
    to: `${req.body['email']} , analeticiarsouza@gmail.com`,
    subject: `Reserva efetuada - Nº ${leftZeros(data['idReserva'].toString())}`,
    text: `Dados da reserva: \n
           Nome: ${req.body['nome']} \n
           E-mail: ${req.body['email']} \n
           CPF: ${req.body['cpf']} \n
           Possui diploma universitário: ${req.body['diploma']} \n
           Produto: ${req.body['produto']}`
  };

  const jsonString = JSON.stringify(data);

  fs.writeFile('./data.json', jsonString, err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Successfully wrote file')
      }
})
  
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
