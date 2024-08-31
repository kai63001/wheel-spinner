import { Slider, ThemeProvider, createTheme } from "@mui/material";
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
      main: "#f48fb1",
    },
  },
});

const CustomizeModal = ({ closeModal, setCustomDuration, duration = 10 }) => {
  const [sliderData, setSliderData] = useState(10);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="w-[700px]">
          <div className="bg-[#1D1D1D] rounded-lg shadow-lg p-6  w-full">
            <div className="text-white mb-6">
              <p>Spin time (seconds)</p>
              <Slider
                aria-label="Temperature"
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
            <div className="flex justify-end">
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
