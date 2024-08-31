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
import { Shuffle as ShuffleIcon, Sort as SortIcon } from "@mui/icons-material";
import { controllerStore } from "../store/controllerStore";

const EntriesComponent = () => {
  const { textRandomList, setTextRandomList } = controllerStore();
  const [entries, setEntries] = useState(textRandomList.join("\n") ?? '');
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    // Count non-empty lines
    setEntryCount(
      entries.split("\n").filter((line) => line.trim() !== "").length
    );
  }, [entries]);

  const handleAddImageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTextChange = (event) => {
    setEntries(event.target.value);
    const array = event.target.value.split("\n");
    console.log(array);
    setTextRandomList(array);
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
        <Tab className="text-white" label="Results 1" />
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
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}></Box>

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
                size="small"
                sx={{ bgcolor: "grey.800", color: "white" }}
              >
                Shuffle
              </Button>
              <Button
                variant="contained"
                startIcon={<SortIcon />}
                size="small"
                sx={{ bgcolor: "grey.800", color: "white" }}
              >
                Sort
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Option 1</MenuItem>
                <MenuItem onClick={handleClose}>Option 2</MenuItem>
              </Menu>
              <Button
                variant="contained"
                size="small"
                sx={{ bgcolor: "grey.800", color: "white" }}
              >
                Advanced
              </Button>
            </Box>

            <TextField
              multiline
              value={entries}
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
      </Box>
    </div>
  );
};

export default EntriesComponent;
