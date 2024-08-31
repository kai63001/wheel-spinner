"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  IconButton,
  TextField,
  Paper,
  Alert,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { socket } from "../socker";

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
          Wheel Cheat Admin
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

const WheelCheatAdmin = () => {
  const [open, setOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordData, setPasswordData] = useState("");

  const [segments, setSegments] = useState([]);
  const [winningOrder, setWinningOrder] = useState([]);
  const [cheatEnabled, setCheatEnabled] = useState(false);

  const checkPassword = () => {
    const passwordAdmin = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "@dmin";
    if (passwordData === passwordAdmin) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleTextChange = (event) => {
    const value = event.target.value;
    setPasswordData(value);
  };

  const fetchSegments = async () => {
    socket.emit("getList");
    socket.on("randomList", (segments) => {
      setSegments(segments);
    });
    socket.on("winningOrder", (order) => {
      setWinningOrder(order);
    });
  };

  const handleCheatToggle = () => {
    const newCheatStatus = !cheatEnabled;
    setCheatEnabled(newCheatStatus);
  };

  const addToWinningOrder = (segment) => {
    if (!winningOrder.includes(segment)) {
      setWinningOrder([...winningOrder, segment]);
    }
  };

  const removeFromWinningOrder = (index) => {
    const newWinningOrder = winningOrder.filter((_, i) => i !== index);
    setWinningOrder(newWinningOrder);
  };

  const handleSetWinningOrder = () => {
    if (socket) {
      socket.emit("setWinningOrder", winningOrder);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      setCheatEnabled(false);
    }
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" className="p-4">
        <Typography variant="h4" className="mb-4">
          Wheel Cheat Admin
        </Typography>

        <FormControlLabel
          control={
            <Switch checked={cheatEnabled} onChange={handleCheatToggle} />
          }
          label="Enable Cheat"
          className="mb-4"
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <Typography variant="h6" className="mb-2">
                Segments
              </Typography>
              <List>
                {segments.map((segment, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={segment} />
                    <IconButton onClick={() => addToWinningOrder(segment)}>
                      <AddIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="p-4">
              <Typography variant="h6" className="mb-2">
                Winning Order
              </Typography>
              <DragDropContext>
                <Droppable droppableId="winningOrder">
                  {(provided) => (
                    <List {...provided.droppableProps} ref={provided.innerRef}>
                      {winningOrder.map((segment, index) => (
                        <Draggable
                          key={segment}
                          draggableId={segment}
                          index={index}
                        >
                          {(provided) => (
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2 bg-gray-800"
                            >
                              <ListItemText
                                primary={`${index + 1}. ${segment}`}
                              />
                              <IconButton
                                onClick={() => removeFromWinningOrder(index)}
                              >
                                <RemoveIcon />
                              </IconButton>
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </DragDropContext>
            </Paper>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSetWinningOrder}
          fullWidth
          className="mt-10"
          disabled={!cheatEnabled || winningOrder.length === 0}
        >
          Set Winning Order
        </Button>

        {open && (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            Update Cheat Successful
          </Alert>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WheelCheatAdmin;
