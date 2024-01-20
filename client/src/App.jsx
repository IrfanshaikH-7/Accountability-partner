import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import io from "socket.io-client"


let socket = io('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });


export default function App() {

  const [qrCode, setQrCode] = useState("");
  const [disable, setDisable] = useState(false)
  const toastId = useRef(null);


  socket.on("qr", (data) => {
    const { qr } = data;
    console.log("QR RECEIVED", qr);
    setQrCode(qr)
  });

  socket.on("ready", () => {
    console.log('All Set, wait for LAST NOTIFICATION!')
  })

  socket.on("groupConnected", (groupId) => {
    setTimeout(() => {
      console.log(groupId)
      console.log('Group is connected too')
    }, 3000)

  })



  const handleSubmit = () => {
    setDisable(true)
    console.log('trying to connect')
    socket.emit("createSession", () => {
      console.log("rendering")
    }
    )

  }


  return (


    <>

      {!qrCode ? (
        <div><p>Loading</p></div>
      ) : (
        <QRCode value={qrCode} className="" />
      )
      }

      {
        !disable ? (
          <button
            onClick={handleSubmit}></button>
        ) : (
          <button onClick={handleSubmit}>
            Click to get QRCode
          </button >
        )
      }


    </>

  )
}
