"use client";

import Controller from "./components/Controller";
import Navbar from "./components/Navbar";
import Spin from "./components/Spin";
import { socket } from "./socker";
import { useEffect, useState } from "react";
import { controllerStore } from "./store/controllerStore";
import {
  Container,
  Typography,
  TextField,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#121212",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

const WheelPasswordAlert = ({
  darkTheme,
  passwordData,
  handleTextChange,
  checkPassword,
}) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" className="p-4">
        <Typography variant="h4" className="mb-4">
          Wheel
        </Typography>

        <Typography variant="h6" className="mb-4">
          Enter Password to Access
        </Typography>

        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          className="mb-4"
          name="password"
          value={passwordData}
          type="password"
          onChange={handleTextChange}
        />

        <Button
          variant="contained"
          onClick={checkPassword}
          color="primary"
          fullWidth
        >
          Enter
        </Button>
      </Container>
    </ThemeProvider>
  );
};


export default function Home() {
  const { textRandomList, setTextRandomList } = controllerStore();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordData, setPasswordData] = useState("");

  const checkPassword = () => {
    const passwordAdmin = process.env.NEXT_PUBLIC_PASSWORD ?? "Dz_156";
    if (passwordData === passwordAdmin) {
      setIsAdmin(true);
    }
  };

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
  
  const handleTextChange = (event) => {
    const value = event.target.value;
    setPasswordData(value);
  };

  if (!isAdmin) {
    return (
      <WheelPasswordAlert
        darkTheme={darkTheme}
        passwordData={passwordData}
        handleTextChange={handleTextChange}
        checkPassword={checkPassword}
      />
    );
  }

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-3 col-span-0"></div>
        <div className="lg:col-span-6 col-span-12 ml-4 lg:ml-0">
          <div id="wheelCircle" className="roboto-medium px-10 lg:px-0">
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
        <div className="lg:col-span-3 col-span-12 lg:mt-0 mt-20">
          <Controller />
        </div>
      </main>
    </>
  );
}
