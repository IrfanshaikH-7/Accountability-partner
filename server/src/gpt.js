
const axios = require('axios')
const twilio = require("twilio");
require("dotenv").config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, OPENAI_API_KEY, organization } = process.env;
const apiUrl = 'https://api.openai.com/v1/chat/completions';


twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = async (req, res) => {
  try {
    const twiml = new twilio.twiml.MessagingResponse();
    const message = req.body.Body;

    const response = await processMessageWithChatGPT(message);
    twiml.message(response);

    res.set("Content-Type", "text/xml");
    res.status(200).send(twiml.toString());
  } catch (error) {
    console.error(error.response.data.error);
    res.status(500).send({
      message: "Something went wrong",
      error: error.response.data.error
    });
  }
};

// Returns a response from OpenAI's GPT-3 API
const processMessageWithChatGPT = async (message) => {

  const messages = [
    { role: 'system', content: 'You are a tutor just generate 1 or 2 links only of specified topic of user ' },
    { role: 'user', content: message },
    { role: 'assistant', content: 'generate 1 or 2 resources and links' },
  ];

  const model = 'gpt-3.5-turbo'


  try {
    const response = await axios.post(
      apiUrl,
      {
        model: model,
        messages: messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    console.log(response.data.choices[0].message.content);
    const generatedText = response.data.choices[0].message.content;
    if (generatedText) {
      console.log('Generated Text:', generatedText);
      return generatedText;
    }
  } catch (error) {
    console.error('Error generating response:', error.message);
  }
};