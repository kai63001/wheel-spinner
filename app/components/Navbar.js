"use client";

import {
  Palette as PaletteIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from "@mui/icons-material";
import CuztomizeModal from "./CustomizeModal";
import { useState } from "react";
import { controllerStore } from "../store/controllerStore";

const Navbar = () => {
  const { duration, setDuration } = controllerStore();
  const [openCustomize, setOpenCustomize] = useState(false);

  return (
    <>
      <nav className="bg-[#3369E8] text-white px-3 py-1.5 flex items-center justify-between mb-10">
        <button className="text-xl">Spiner</button>
        <ul className="flex">
          <li>
            <button
              onClick={() => setOpenCustomize(true)}
              className="px-3 py-2 hover:bg-blue-400 flex space-x-2"
            >
              <PaletteIcon />
              <div>Customize</div>
            </button>
          </li>
        </ul>
      </nav>
      {openCustomize && (
        <CuztomizeModal
          closeModal={() => {
            setOpenCustomize(false);
          }}
          setCustomDuration={(e) => {
            setOpenCustomize(false);
            setDuration(e);
          }}
          duration={duration}
        />
      )}
    </>
  );
};

export default Navbar;
