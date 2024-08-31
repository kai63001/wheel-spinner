"use client";

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
            winningSegment="Surprised"
            buttonText="Spin"
            isOnlyOnce={false}
            upDuration={5}
            downDuration={100}
          />
        </div>
      </div>
      <div className="col-span-3">
        <div className="roboto-medium "> test fontttt</div>
      </div>
    </main>
  );
}
