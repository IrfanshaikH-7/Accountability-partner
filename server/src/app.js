const express = require("express");
const chatgpt = require("../src/gpt");
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Hello there"));

app.post("/setnum/:number", (req, res) => {

  // console.log("number" + req.params.number)
  const number = req.params.number;
  client.messages
    .create({
      body: 'Your appointment is coming up on July 21 at 3PM',
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+91${number}`
    })

  res.status(200).json({ msg: 'ok' })
})

app.post("/gpt", chatgpt);

module.exports = app;