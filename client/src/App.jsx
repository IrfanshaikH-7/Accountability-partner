import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import io from "socket.io-client"
import './app.css'


// let socket = io('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });


export default function App() {

  const [qrCode, setQrCode] = useState("");
  const [GroupName, setGroupName] = useState("");
  const [disable, setDisable] = useState(false)
  const [confirmed, setConfirmed] = useState(false);
  const toastId = useRef(null);
  const url = "http://localhost:3000"

  // socket.on("qr", (data) => {
  //   const { qr } = data;
  //   console.log("QR RECEIVED", qr);
  //   setQrCode(qr)
  // });

  // socket.on("ready", () => {
  //   console.log('All Set, wait for LAST NOTIFICATION!')
  // })

  // socket.on("groupConnected", (groupId) => {
  //   setTimeout(() => {
  //     console.log(groupId)
  //     console.log('Group is connected too')
  //   }, 3000)

  // })

  console.log(confirmed)
  if (confirmed) {
    handleRoute();
  }

  const handleRoute = async () => {

    try {
      const resp = await fetch(`${url}/setnum/${GroupName}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
      });

      const temp = await resp.json();
      console.log(temp)
    } catch (error) {
      console.log(error)
    }

    console.log(GroupName)

    setDisable(true)
    console.log('trying to connect')
    socket.emit("createSession", () => {
      console.log("rendering")
    }
    )
    setDisable(false)
    setGroupName('')

  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setQrCode('https://wa.me/+14155238886?text=join%20you-wish')

  }


  return (
    <>
      <div className="ui__content">
        <h2>Connect with Whatsup bot</h2>
        <p>Learn and explore new skills with the help of advanced AI bot </p>
      </div>
      <div className="content__container">
        {!qrCode ? (
          <div className="qr__"><p>QR will generate here.</p></div>
        ) : (
          <QRCode value={qrCode} className="qr__" />
        )
        }
        <form className="form__" onSubmit={handleSubmit} >
          <input type="text" onChange={(e) => setGroupName(e.target.value)} value={GroupName} className="input__" placeholder="Enter your whatsup group name" />
          <button
            type="submit">
            Click to get QRCODE
          </button>
        </form>
      </div>
      <input type="checkbox" value={confirmed} onClick={() => setConfirmed((prevState) => !prevState)} />

    </>

  )
}
