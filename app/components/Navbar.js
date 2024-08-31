"use client";

import {
  Palette as PaletteIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Folder as FolderIcon,
  Share as ShareIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Fullscreen as FullscreenIcon,
  ArrowDropDown as ArrowDownwardIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import CuztomizeModal from "./CustomizeModal";
import { useState } from "react";
import { controllerStore } from "../store/controllerStore";
import { socket } from "../socker";

const Navbar = () => {
  const { duration, setDuration } = controllerStore();
  const [openCustomize, setOpenCustomize] = useState(false);

  const newHandle = () => {
    const sortedArray = ["Charles", "Diana", "Edward", "Elizabeth", "George", "Harry", "Philip", "William"];
    socket.emit("updateEntries", sortedArray);
  }

  return (
    <>
      <nav className="bg-[#3369E8] text-white px-3 py-1.5 flex items-center justify-between mb-10">
        <button className="text-xl">Spiner</button>
        <ul className="flex">
          <li>
            <button
              onClick={() => setOpenCustomize(true)}
              className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2"
            >
              <PaletteIcon />
              <div>Customize</div>
            </button>
          </li>
          <li>
            <button onClick={newHandle} className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2">
              <InsertDriveFileIcon />
              <div>New</div>
            </button>
          </li>
          <li>
            <button className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2">
              <FolderIcon />
              <div>Open</div>
            </button>
          </li>
          <li>
            <button className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2">
              <SaveIcon />
              <div>Save</div>
            </button>
          </li>
          <li>
            <button className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2">
              <ShareIcon />
              <div>Share</div>
            </button>
          </li>
          <li>
            <button className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2">
              <SearchIcon />
              <div>Gallery</div>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else if (document.exitFullscreen) {
                  document.exitFullscreen();
                }
              }}
              className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2"
            >
              <FullscreenIcon />
            </button>
          </li>
          <li>
            <button className="px-3 py-2 items-center hover:bg-blue-400/50 flex space-x-2">
              <p>More</p>
              <ArrowDownwardIcon fontSize="10px" />
            </button>
          </li>
          <li>
            <button className="ml-2 px-3 py-2 hover:bg-blue-400/50 flex space-x-2">
              <LanguageIcon />
              <p>English</p>
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
