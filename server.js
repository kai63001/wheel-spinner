import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, port });
const handler = app.getRequestHandler();
let list = ["Alex", "Jon", "Doe", "Jane","Alice", "Bob", "Charlie"];
let winningOrder = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("updateEntries", (msg) => {
      console.log("message: " + msg);
      list = msg;
      io.emit("randomList", msg);
    })

    socket.on("getList", () => {
      io.emit("randomList", list);
    });
    
    socket.on("setWinningOrder", (order) => {
      console.log("setWinningOrder", order);
      winningOrder = order;
      io.emit("winningOrder", winningOrder);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
