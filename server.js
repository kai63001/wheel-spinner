import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, port });
const handler = app.getRequestHandler();
let list = ["Alex", "Jon", "Doe", "Jane", "Alice", "Bob", "Charlie"];
let winningOrder = [];
let result = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("updateEntries", (msg) => {
      list = msg;
      io.emit("randomList", msg);
    });

    socket.on("getList", () => {
      io.emit("randomList", list);
      io.emit("winningOrder", winningOrder);
      io.emit("result", result);
    });

    socket.on("setWinningOrder", (order) => {
      winningOrder = order;
      io.emit("winningOrder", winningOrder);
    });

    socket.on("addResult", (res) => {
      result.push(res);
      console.log(result);
      io.emit("result", result);
    });

    socket.on("setResult", (res) => {
      result = res;
      io.emit("result", result);
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
