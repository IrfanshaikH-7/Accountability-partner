const { createServer } = require("node:http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const { Client, LocalAuth } = require("whatsapp-web.js");

const port = 3000;

const app = express();
const server = createServer(app);
app.use(
  cors({
    origin: "*"
  })
);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let groupId = '';
io.on("connection", socket => {
  // socket.on("chat message", msg => {
  //   console.log("message: " + msg);
  // });

  const whatsappClient = new Client({
    puppeteer: {
      headless: true
    },
    authStrategy: new LocalAuth({
      clientId: "something"
    })
  });


  const createWhatsappSession = socket => {
    whatsappClient.on("qr", qr => {
      console.log(qr)
      // qrcode.generate(qr, { small: true });
      socket.emit("qr", {
        qr
      });
    });

    whatsappClient.on("ready", () => {
      console.log("Client is ready!");
      socket.emit("ready", { message: "Client is ready!" });
      whatsappClient.getChats().then(res => {
        const group = res.find(chat => chat.name === "Notes"); // this need to take from user
        console.log("groupdetails " + group);
        groupId = group.id._serialized;
        socket.emit("groupConnected", groupId => {
          message: groupId;
        });
      });
    });
    whatsappClient.initialize();

    whatsappClient.on("message_create", async msg => {
      if (msg.fromMe && msg.to === groupId) {
        console.log(msg.body);
      }
    });
  };

  socket.on("createSession", (data) => {
    createWhatsappSession(socket);
  });
});

server.listen(port, () => {
  console.log("listening on :", port);
})