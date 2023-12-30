import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

class WebSocketServer {
  private app: express.Application;
  private server: http.Server;
  private io: Server;
  private allowedOrigins: string[] = [];

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    this.io = new Server(this.server, {
      cors: {
        origin: this.allowedOrigins,
        methods: ["GET", "POST", "OPTIONS"],
      },
    });

    this.configureRoutes();
    this.configureSocketIO();
  }

  private configureRoutes() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.get("/", (req, res) => {
      console.log("websocket server started");
    });

    this.app.post("/send-notification", (req, res) => {
      const notification = req.body;

      if (notification) {
        this.io.emit("notification", notification);
        return res.json({
          success: true,
          message: "Notificação enviada com sucesso",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Formato de notificação inválido" });
      }
    });
  }

  private configureSocketIO() {
    this.io.on("connection", (socket: Socket) => {
      console.log("Usuário conectado");

      socket.on("notification", () => {
        console.log("Recebido evento de notificação");
        socket.emit("notification", { notification: "ok" });
      });

      socket.on("disconnect", () => {
        console.log("Usuário desconectado");
      });
    });
  }

  public startServer(port: number) {
    this.server.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  }
}

const PORT = 3000;
const webSocketServer = new WebSocketServer();
webSocketServer.startServer(PORT);
