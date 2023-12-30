import { useEffect, useState } from "react";
import "./App.css";

import io from "socket.io-client";

type NotificationType = {
  notification: string;
};

function App() {
  const [receivedNotification, setReceivedNotication] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Conectado ao servidor WebSocket");
    });

    socket.on("notification", (data: NotificationType) => {
      setReceivedNotication(data.notification);
      console.log("Recebido evento de notificação:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <p>
        View notification in{" "}
        <a href="http://localhost:5174" target="_blank">
          Vue.js app
        </a>
        {receivedNotification && <p>Notication: {receivedNotification}</p>}
      </p>
    </>
  );
}

export default App;
