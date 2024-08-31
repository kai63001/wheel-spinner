"use client";

import Controller from "./components/Controller";
import Navbar from "./components/Navbar";
import Spin from "./components/Spin";
import { inter } from "./fonts";

export default function Home() {
  const segments = [
    "Happy",
    "Angry",
    "Sad",
    "Frustration",
    "Emptyness",
    "Excited",
    "Bored",
    "Surprised",
    "Confused",
    "Relaxed",
    "Anxious",
    "Joyful",
    "Disappointed",
    "Curious",
    "Content",
  ];

  const segColors = [
    "#009925",
    "#D61024",
    "#EEB212",
    "#3369E8",
    "#009925",
    "#D61024",
    "#EEB212",
    "#3369E8",
    "#009925",
    "#D61024",
    "#EEB212",
    "#3369E8",
    "#009925",
    "#D61024",
    "#EEB212",
  ];

  return (
    <>
    <header>
      <Navbar />
    </header>
    <main className="grid grid-cols-12 gap-4">
      <div className="col-span-3">asd</div>
      <div className="col-span-6">
        <div id="wheelCircle" className="roboto-medium ">
          <Spin
            segments={segments}
            segColors={segColors}
            primaryColor="white"
            primaryColoraround="#ffffffb4"
            contrastColor="white"
            // winningSegment="Alex"
            isOnlyOnce={false}
            upDuration={5}
            downDuration={100}
          />
        </div>
      </div>
      <div className="col-span-3">
        <Controller />
      </div>
    </main>
    </>
  );
}
