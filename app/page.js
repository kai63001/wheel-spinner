"use client";

import Controller from "./components/Controller";
import Navbar from "./components/Navbar";
import Spin from "./components/Spin";
import { socket } from "./socker";
import { useEffect, useState } from "react";
import { controllerStore } from "./store/controllerStore";

export default function Home() {
  const { textRandomList, setTextRandomList } = controllerStore();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
      socket.emit("getList");
      socket.on("randomList", (segments) => {
        if (segments) {
          setTextRandomList(segments);
        } else {
          //init data
          socket.emit("updateEntries", textRandomList);
        }
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-3 col-span-1"></div>
        <div className="lg:col-span-6 col-span-11 ml-4 lg:ml-0">
          <div id="wheelCircle" className="roboto-medium ">
            <Spin
              primaryColor="white"
              primaryColoraround="#ffffffb4"
              contrastColor="white"
              isOnlyOnce={false}
              upDuration={5}
              downDuration={100}
            />
          </div>
        </div>
        <div className="lg:col-span-3 col-span-12">
          <Controller />
        </div>
      </main>
    </>
  );
}
