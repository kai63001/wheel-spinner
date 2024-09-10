"use client";

import {
  Palette as PaletteIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Folder as FolderIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Search as SearchIcon,
  Fullscreen as FullscreenIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Feedback as FeedbackIcon,
  Help as HelpIcon,
  OndemandVideo as OndemandVideoIcon,
  School as SchoolIcon,
  Policy as PolicyIcon,
  Gavel as GavelIcon,
  Link as LinkIcon,
  Menu as MenuIcon,
  ArrowDropDown as ArrowDownwardIcon,
} from "@mui/icons-material";
import CuztomizeModal from "./CustomizeModal";
import { useState, useRef, useEffect } from "react";
import { controllerStore } from "../store/controllerStore";
import { socket } from "../socker";
import Image from "next/image";

const Navbar = () => {
  const { duration, setDuration, spining } = controllerStore();
  const [openCustomize, setOpenCustomize] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const newHandle = () => {
    if (spining) return null;
    const sortedArray = [
      "Charles",
      "Diana",
      "Edward",
      "Elizabeth",
      "George",
      "Harry",
      "Philip",
      "William",
    ];
    socket.emit("updateEntries", sortedArray);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { icon: <FolderIcon fontSize="small" />, text: "Open" },
    { icon: <SaveIcon fontSize="small" />, text: "Save" },
    { icon: <ShareIcon fontSize="small" />, text: "Share" },
    { icon: <SearchIcon fontSize="small" />, text: "Gallery" },
    { icon: <FullscreenIcon fontSize="small" />, text: "Fullscreen" },
    { icon: <DarkModeIcon fontSize="small" />, text: "Dark mode" },
    { icon: <LanguageIcon fontSize="small" />, text: "Language" },
    { icon: <FeedbackIcon fontSize="small" />, text: "Feedback" },
    { icon: <HelpIcon fontSize="small" />, text: "FAQ" },
    {
      icon: <OndemandVideoIcon fontSize="small" />,
      text: "User reviews and tutorials",
    },
    {
      icon: <SchoolIcon fontSize="small" />,
      text: "Use this in the classroom",
    },
    { icon: <PolicyIcon fontSize="small" />, text: "Privacy policy" },
    { icon: <GavelIcon fontSize="small" />, text: "Terms & conditions" },
    { icon: <LinkIcon fontSize="small" />, text: "Link Google Spreadsheet" },
  ];

  return (
    <>
      <nav className="bg-[#3369E8] text-white px-3 py-1.5 flex items-center justify-between mb-10 relative">
        <button className="text-xl flex items-center space-x-2">
          <Image
            src="/icon.png"
            width={39}
            height={39}
            alt="logo"
            className="rounded-full hidden lg:block"
          />
          <p>wheelofnames.com</p>
        </button>
        <ul className="hidden lg:flex">
          <li>
            <button
              onClick={() => {
                if (spining) return null;
                setOpenCustomize(true);
              }}
              className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2"
            >
              <PaletteIcon />
              <div>Customize</div>
            </button>
          </li>
          <li>
            <button
              onClick={newHandle}
              className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2"
            >
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
        <ul className="lg:hidden flex">
          <li>
            <button
              ref={buttonRef}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className="px-3 py-2 hover:bg-blue-400/50 flex space-x-2"
            >
              <MenuIcon />
            </button>
          </li>
        </ul>
        {isOpen && (
          <ul
            ref={menuRef}
            className="absolute top-10 right-0 mt-2 w-64 bg-[#1D1D1D] rounded-md shadow-lg z-10 text-white lg:hidden block"
          >
            <li
              onClick={() => {
                setOpenCustomize(true);
                setIsOpen(false);
              }}
              className="px-5 flex items-center py-3 space-x-5"
            >
              <PaletteIcon fontSize="small" />
              <p className="text-sm">Customize</p>
            </li>
            <li
              onClick={() => {
                newHandle();
                setIsOpen(false);
              }}
              className="px-5 flex items-center py-3 space-x-5"
            >
              <InsertDriveFileIcon fontSize="small" />
              <p className="text-sm">New</p>
            </li>
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setIsOpen(false);
                }}
                className="px-5 flex items-center py-3 space-x-5"
              >
                {item.icon}
                <p className="text-sm">{item.text}</p>
              </li>
            ))}
          </ul>
        )}
      </nav>
      <CuztomizeModal
        closeModal={() => {
          setOpenCustomize(false);
        }}
        setCustomDuration={(e) => {
          setOpenCustomize(false);
          setDuration(e);
        }}
        duration={duration}
        isVisible={openCustomize}
      />
    </>
  );
};

export default Navbar;
