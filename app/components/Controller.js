import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Shuffle as ShuffleIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { socket } from "../socker";
import { controllerStore } from "../store/controllerStore";

const EntriesComponent = () => {
  const { spining } = controllerStore();
  const [entries, setEntries] = useState("");
  const [result, setResult] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [entryCount, setEntryCount] = useState(0);
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    // Count non-empty lines
    if (entries) {
      setEntryCount(
        entries?.split("\n").filter((line) => line.trim() !== "").length
      );
    }
    if (result) {
      setResultCount(
        result?.split("\n").filter((line) => line.trim() !== "").length
      );
    }
  }, [entries, result]);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    socket.emit("getList");
    socket.on("randomList", (segments) => {
      setEntries(segments.join("\n"));
    });
    socket.on("result", (res) => {
      console.log("resutl", res);
      setResult(res.join("\n"));
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTextChange = (event) => {
    setEntries(event.target.value);
    const array = event.target.value.split("\n");
    socket.emit("updateEntries", array);
  };

  const clearListResult = () => {
    setResult("");
    setResultCount(0);
    socket.emit("setResult", []);
  };

  const shuffleEntries = () => {
    const array = entries.split("\n");
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    setEntries(shuffledArray.join("\n"));
    socket.emit("updateEntries", shuffledArray);
  };

  const sortEntries = () => {
    const array = entries.split("\n");
    const sortedArray = array.sort();
    setEntries(sortedArray.join("\n"));
    socket.emit("updateEntries", sortedArray);
  };

  const sortResult = () => {
    const array = result.split("\n");
    const sortedArray = array.sort();
    setResult(sortedArray.join("\n"));
    socket.emit("setResult", sortedArray);
  };

  return (
    <div className="mr-5 rounded-md h-full">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="entries tabs"
        textColor="inherit"
      >
        <Tab className="text-white" label={`Entries ${entryCount}`} />
        <Tab className="text-white" label={`Result ${resultCount}`} />
      </Tabs>
      <Box
        sx={{
          margin: "auto",
          bgcolor: "grey.900",
          color: "white",
          borderRadius: 1,
          p: 2,
          height: "90%",
        }}
      >
        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControlLabel
          control={<Checkbox sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
          label="Hide"
        />
      </Box> */}

        {tabValue === 0 && (
          <>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<ShuffleIcon />}
                onClick={shuffleEntries}
                size="small"
                sx={{ bgcolor: "grey.800", color: "white" }}
              >
                Shuffle
              </Button>
              <Button
                onClick={sortEntries}
                variant="contained"
                startIcon={<SortIcon />}
                size="small"
                sx={{ bgcolor: "grey.800", color: "white" }}
              >
                Sort
              </Button>
            </Box>

            <TextField
              multiline
              value={entries}
              disabled={spining}
              onChange={handleTextChange}
              variant="outlined"
              sx={{
                width: "100%",
                height: "90%",
                "& .MuiTextField-root": {
                  height: "100%",
                },
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  backgroundColor: "#333333",
                  height: "100%",
                  "& fieldset": {
                    borderColor: "#444444",
                  },
                  "&:hover fieldset": {
                    borderColor: "#555555",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#666666",
                  },
                  "& textarea": {
                    height: "100% !important",
                    overflowY: "auto !important",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#333333",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888888",
                    borderRadius: "5px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555555",
                  },
                },
              }}
            />
          </>
        )}

        {tabValue === 1 && (
          <>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<SortIcon />}
                onClick={sortResult}
                size="small"
                sx={{ bgcolor: "grey.800", color: "white" }}
              >
                Sort
              </Button>
              <Button
                variant="contained"
                startIcon={<ClearIcon />}
                onClick={clearListResult}
                size="small"
                sx={{ bgcolor: "grey.800", color: "white" }}
              >
                Clear the list
              </Button>
            </Box>

            <TextField
              multiline
              value={result}
              disabled={true}
              variant="outlined"
              sx={{
                width: "100%",
                height: "90%",
                "& .MuiTextField-root": {
                  height: "100%",
                },
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  backgroundColor: "#333333",
                  height: "100%",
                  "& fieldset": {
                    borderColor: "#444444",
                  },
                  "&:hover fieldset": {
                    borderColor: "#555555",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#666666",
                  },
                  "& textarea": {
                    height: "100% !important",
                    overflowY: "auto !important",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#333333",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888888",
                    borderRadius: "5px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555555",
                  },
                },
              }}
            />
          </>
        )}
      </Box>
    </div>
  );
};

export default EntriesComponent;
