"use client";
import React, { useEffect, useState, useRef } from "react";
import "../globals.css";

const Spin = ({
  segments,
  segColors,
  winningSegment,
  onRotate,
  onRotatefinish,
  primaryColor,
  primaryColoraround,
  contrastColor,
  buttonText,
  isOnlyOnce = true,
  upDuration = 1000,
  downDuration = 1000,
  fontFamily = "Quicksand",
  width = 100,
  height = 100,
}) => {
  const [currentSegment, setCurrentSegment] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const canvasRef = useRef(null);
  const timerHandle = useRef(0);
  const idleIntervalRef = useRef(null);

  const [angleCurrent, setAngleCurrent] = useState(0);
  const [angleDelta, setAngleDelta] = useState(0);
  const maxSpeed = Math.PI / (segments?.length || 1);
  const size = 300;
  const centerX = 300;
  const centerY = 300;

  useEffect(() => {
    wheelInit();
    startIdleSpin();

    return () => {
      clearInterval(idleIntervalRef.current);
      clearInterval(timerHandle.current);
    };
  }, []);

  const wheelInit = () => {
    initCanvas();
    draw();
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
      "https://fonts.googleapis.com/css?family=Quicksand&display=swap";
    document.getElementsByTagName("head")[0].appendChild(link);
    if (canvas) {
      canvas.addEventListener("click", spin);
    }
  };

  const startIdleSpin = () => {
    if (!isStarted) {
      const slowSpinSpeed = 0.005;
      idleIntervalRef.current = setInterval(() => {
        setAngleCurrent((prev) => prev + slowSpinSpeed);
      }, 30);
    }
  };

  const stopIdleSpin = () => {
    clearInterval(idleIntervalRef.current);
  };

  const spin = () => {
    if (isStarted) return;
    setIsStarted(true);
    stopIdleSpin();
    setAngleCurrent(0);

    const totalDuration = 5000; // Total time the spin should take
    const startTime = new Date().getTime();

    const targetAngle = getTargetAngle();

    const spinInterval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - startTime;
      let progress = elapsed / totalDuration;

      if (progress >= 1) {
        progress = 1;
        clearInterval(spinInterval);
        setFinished(true);
        setIsStarted(false);
        console.log("Finished spinning", currentSegment);
      }

      // Easing function for smooth deceleration
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      const newAngleCurrent = targetAngle * easedProgress;
      setAngleCurrent(newAngleCurrent);

      // Calculate the segment index correctly
      const segmentAngle = (Math.PI * 2) / segments.length;
      const normalizedAngle =
        ((newAngleCurrent % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
      const newSegment = segments[segments.length - 1 - segmentIndex];

      console.log("Segment index", segmentIndex, "Segment", newSegment);

      setCurrentSegment(newSegment);
    }, 20);
  };

  const getTargetAngle = () => {
    const numberOfSegments = segments.length;
    const segmentAngle = (Math.PI * 2) / numberOfSegments;

    if (winningSegment) {
      const winningIndex = segments.indexOf(winningSegment);
      if (winningIndex !== -1) {
        // Calculate the exact angle to stop at the center of the winning segment
        return (
          (numberOfSegments - winningIndex - 0.5) * segmentAngle + Math.PI * 4
        ); // Add extra rotations
      }
    }

    // Random end point if no winning segment
    const randomSegment = Math.floor(Math.random() * numberOfSegments);
    return (
      (numberOfSegments - randomSegment - 0.5) * segmentAngle + Math.PI * 4
    );
  };

  const drawSegment = (ctx, key, lastAngle, angle) => {
    const value = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key];
    ctx.fill();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = contrastColor || "white";
    ctx.font = "bold 40px " + fontFamily;
    ctx.fillText(value.substr(0, 21), size / 2 + 120, 0);
    ctx.restore();
  };

  const drawWheel = (ctx) => {
    let lastAngle = angleCurrent;
    const len = segments?.length || 0;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor || "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.font = "1em " + fontFamily;
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(ctx, i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = primaryColor || "white";
    ctx.lineWidth = 5;
    ctx.strokeStyle = contrastColor || "white";
    ctx.fill();
    ctx.stroke();
  };

  const drawNeedle = (ctx) => {
    ctx.lineWidth = 2;
    ctx.fillStyle = "#BBBBBB";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(centerX + size, centerY);
    ctx.lineTo(centerX + size + 40, centerY - 20);
    ctx.lineTo(centerX + size + 40, centerY + 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (isStarted) {
      ctx.fillStyle = contrastColor || "white";
      ctx.font = "bold 20px " + fontFamily;
      ctx.fillText(currentSegment, centerX + size + 50, centerY);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 1000, 800);
      drawWheel(ctx);
      drawNeedle(ctx);
    }
  };

  useEffect(() => {
    draw();
  }, [angleCurrent, currentSegment]);

  return (
    <div id="wheel">
      <canvas
        ref={canvasRef}
        className="roboto-medium"
        id="canvas"
        width="700"
        height="700"
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto",
          width: "100%",
        }}
      />
    </div>
  );
};

export default Spin;
