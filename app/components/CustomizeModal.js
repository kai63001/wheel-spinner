import {
  Box,
  Slider,
  Tab,
  Tabs,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormControl,
  Button,
  InputLabel,
  Divider,
  Tooltip,
  ThemeProvider,
  IconButton,
  createTheme,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  HelpRounded as FeedbackIcon,
} from "@mui/icons-material";
import { useState } from "react";

function valuetext(value) {
  return `${value}s`;
}
const marks = [
  {
    value: 1,
    label: "1s",
  },
  {
    value: 10,
    label: "10s",
  },
  {
    value: 20,
    label: "20s",
  },
  {
    value: 30,
    label: "30s",
  },
  {
    value: 40,
    label: "40s",
  },
  {
    value: 50,
    label: "50s",
  },
  {
    value: 60,
    label: "60s",
  },
];

const marksSound = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

let markNumberData = Array.from({ length: 10 }, (_, i) => ({
  value: (i + 1) * 100,
  label: `${(i + 1) * 100}`,
}));

let markNumber = [
  {
    value: 4,
    label: "4",
  },
  ...markNumberData,
];

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#121212",
    },
    primary: {
      main: "#3369E8",
    },
    secondary: {
      main: "#ffff",
    },
  },
});

const CustomizeModal = ({ closeModal, setCustomDuration, duration = 10 }) => {
  const [sliderData, setSliderData] = useState(10);
  const [value, setValue] = useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div
        className="h-full w-full bg-black/50 fixed z-30 -top-0 left-0"
        onClick={() => {
          console.log('close')
          closeModal();
        }}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-40 w-[700px] m-auto h-[500px] bg-black">
        <div className="w-[700px]">
          <div className="bg-[#1D1D1D] rounded-lg shadow-lg p-6  w-full">
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
              centered
            >
              <Tab value="one" label="During spin" />
              <Tab value="two" label="After spin" />
              <Tab value="three" label="Appearance" />
            </Tabs>
            <Box className="bg-[#171717] p-4 text-white">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <Typography gutterBottom>Sound</Typography>
                </div>
                <div className="col-span-10 flex">
                  <FormControl variant="filled" className="w-full">
                    <Select
                      sx={{
                        height: "40px",
                        padding: "0px 0px 15px 0px",
                        "& input": { padding: "10px" },
                      }}
                      defaultValue={1}
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={1}>Ticking sound</MenuItem>
                    </Select>
                  </FormControl>
                  <button
                    disabled
                    className=" text-white py-2 px-4 rounded ml-2 cursor-not-allowed"
                  >
                    <PlayArrowIcon />
                  </button>
                  <button
                    disabled
                    className="text-white py-2 px-4 rounded ml-2 cursor-not-allowed"
                  >
                    <StopIcon />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <Typography gutterBottom sx={{ mt: 2 }}>
                    Volume
                  </Typography>
                </div>
                <div className="col-span-10 flex items-center mt-6 pr-2">
                  <Slider
                    size="medium"
                    valueLabelDisplay="auto"
                    shiftStep={30}
                    step={1}
                    marks={marksSound}
                    defaultValue={50}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
              <Divider className="my-4" />
              <Box sx={{ mt: 2 }} className="flex">
                <div className="flex">
                  <FormControlLabel
                    control={<Checkbox checked={true} />}
                    label="Display duplicates"
                  />
                  <Tooltip title="" className="-ml-5">
                    <IconButton>
                      <FeedbackIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                <FormControlLabel
                  control={<Checkbox checked={false} />}
                  label="Spin slowly"
                />
                <FormControlLabel
                  control={<Checkbox checked={true} />}
                  label="Show title"
                />
              </Box>
              <Divider className="my-4" />
              <div className="text-white mb-6">
                <p>Spin time (seconds)</p>
                <Slider
                  size="medium"
                  defaultValue={duration}
                  getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  shiftStep={30}
                  step={1}
                  marks={marks}
                  onChange={(e, value) => {
                    setSliderData(value);
                  }}
                  min={1}
                  max={60}
                />
              </div>
              <Divider className="my-4" />
              <Typography gutterBottom sx={{ mt: 2 }}>
                Max number of names visible on the wheel
              </Typography>
              <Typography variant="caption">
                All names in the text box have the same chance of winning,
                regardless of this value.
              </Typography>
              <Slider
                size="medium"
                defaultValue={500}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks={markNumber}
                min={4}
                max={1000}
              />
            </Box>
            <div className="flex justify-end mt-5">
              <button
                onClick={closeModal}
                className=" text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCustomDuration(sliderData);
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default CustomizeModal;
