import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Input,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Shuffle as ShuffleIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
  CheckBox,
  Image as ImageIcon,
  ArrowDropDown as Drop,
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
      setResult(res.join("\n"));
      forFixFont();
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

  const forFixFont = () => {
    setTimeout(() => {
      const data = document.querySelector("textarea").value;
      setEntries(data);
      const array = data.split("\n");
      socket.emit("updateEntries", array);
    }, 1000);
  };

  const clearListResult = () => {
    setResult("");
    setResultCount(0);
    socket.emit("setResult", []);
  };

  const shuffleEntries = () => {
    if (spining) return null;
    const array = entries.split("\n");
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    setEntries(shuffledArray.join("\n"));
    socket.emit("updateEntries", shuffledArray);
  };

  const sortEntries = () => {
    if (spining) return null;
    const array = entries.split("\n");
    const sortedArray = array.sort();
    setEntries(sortedArray.join("\n"));
    socket.emit("updateEntries", sortedArray);
  };

  const sortResult = () => {
    if (spining) return null;
    const array = result.split("\n");
    const sortedArray = array.sort();
    setResult(sortedArray.join("\n"));
    socket.emit("setResult", sortedArray);
  };

  return (
    <div className="mr-0 px-5 lg:px-0 lg:mr-5 rounded-md h-full min-h-[500px] -mt-20 lg:-mt-0">
      <div className="flex justify-between w-full text-white items-end">
        <Tabs aria-label="entries tabs" textColor="inherit">
          <div className="flex -mb-12 border-gray-700">
            {[
              {
                label: "Entries",
                id: 0,
              },
              {
                label: "Result",
                id: 1,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`py-1 px-4 flex items-center space-x-2 ${
                  tabValue === tab.id
                    ? "text-white border-b-2 border-white"
                    : "text-gray-400"
                }`}
                onClick={() => setTabValue(tab.id)}
              >
                <div>{tab.label}</div>
                <div className="w-5 h-5 items-center m-auto flex text-center justify-center text-[10px] rounded-full bg-[#757575]">
                  {tab.label === "Entries" ? entryCount : resultCount}
                </div>
              </button>
            ))}
          </div>
        </Tabs>
        <div>
          {/* check box label Hide */}
          <FormGroup>
            <FormControlLabel
              control={<Checkbox size="small" checked={false} />}
              label="Hide"
              className="text-sm"
              sx={{ fontSize: "10px", "& span": { fontSize: "13px" } }}
            />
          </FormGroup>
        </div>
      </div>
      <Box
        sx={{
          margin: "auto",
          bgcolor: "#1d1d1d",
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
            <Box sx={{ display: "flex", gap: 1, mb: 2, background: "#1d1d1d" }}>
              <Button
                variant="contained"
                startIcon={<ShuffleIcon />}
                onClick={shuffleEntries}
                size="small"
                sx={{
                  bgcolor: "grey.800",
                  color: "white",
                  fontSize: "10px",
                  textTransform: "none",
                }}
              >
                Shuffle
              </Button>
              <Button
                onClick={sortEntries}
                variant="contained"
                startIcon={<SortIcon />}
                size="small"
                sx={{
                  bgcolor: "grey.800",
                  color: "white",
                  fontSize: "10px",
                  textTransform: "none",
                }}
              >
                Sort
              </Button>

              <Button
                onClick={sortEntries}
                variant="contained"
                startIcon={<ImageIcon />}
                endIcon={<Drop />}
                size="small"
                sx={{
                  bgcolor: "grey.800",
                  color: "white",
                  fontSize: "10px",
                  textTransform: "none",
                }}
              >
                Add image
              </Button>

              {/* check box Advance */}
              <FormGroup className="h-3 -mt-1.5 ml-2">
                <FormControlLabel
                  control={<Checkbox size="small" checked={false} />}
                  label="Advanced"
                  className="text-sm"
                  sx={{ fontSize: "10px", "& span": { fontSize: "11px" } }}
                />
              </FormGroup>
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
                  backgroundColor: "#1d1d1d",
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
                  "&.Mui-disabled": {
                    "& .MuiOutlinedInput-input": {
                      color: "white", // Text color when disabled
                    },
                    "& fieldset": {
                      borderColor: "#444444", // Border color when disabled
                    },
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
                sx={{
                  bgcolor: "grey.800",
                  color: "white",
                  fontSize: "10px",
                  textTransform: "none",
                }}
              >
                Sort
              </Button>
              <Button
                variant="contained"
                startIcon={<ClearIcon />}
                onClick={clearListResult}
                size="small"
                sx={{
                  bgcolor: "grey.800",
                  color: "white",
                  fontSize: "10px",
                  textTransform: "none",
                }}
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
                  backgroundColor: "#1d1d1d",
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
                  "&.Mui-disabled": {
                    "& .MuiOutlinedInput-input": {
                      color: "white", // Text color when disabled
                    },
                    "& fieldset": {
                      borderColor: "#444444", // Border color when disabled
                    },
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
