"use client";
import React, { useEffect, useState, useRef } from "react";
import "../globals.css";
import { socket } from "../socker";

const Spin = ({
  winningSegment,
  primaryColor,
  contrastColor,
  isOnlyOnce = true,
  fontFamily = "Quicksand",
}) => {
  const [segments, setSegments] = useState([]);
  const [segColors, setSegColors] = useState([]);
  const listColors = ["#009925", "#D61024", "#EEB212", "#3369E8"];
  const [currentSegment, setCurrentSegment] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const canvasRef = useRef(null);
  const idleIntervalRef = useRef(null);
  const [winningOrder, setWinningOrder] = useState([]);

  const [angleCurrent, setAngleCurrent] = useState(0);
  const size = 300;
  const centerX = 300;
  const centerY = 300;
  const [globalFontSize, setGlobalFontSize] = useState(40);

  const calculateGlobalFontSize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const availableWidth = size / 2 + 60;
      let fontSize = 60;

      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      if (segments.length < 2) return;

      const longestText = segments.reduce((a, b) =>
        a.length > b.length ? a : b
      );

      let textWidth = ctx.measureText(longestText).width;

      while (textWidth > availableWidth && fontSize > 25) {
        fontSize--;
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        textWidth = ctx.measureText(longestText).width;
      }

      setGlobalFontSize(fontSize);
    }
  };

  useEffect(() => {
    //
    initData();
    wheelInit();
    fetchSegments();
    startIdleSpin();

    return () => {
      stopIdleSpin();
    };
  }, []);

  const fetchSegments = async () => {
    socket.emit("getList");
    socket.on("randomList", (segments) => {
      setSegments(segments);
      setSegColors(
        segments.map((_, i) => {
          return listColors[i % listColors.length];
        })
      );
    });
    socket.on("winningOrder", (order) => {
      setWinningOrder(order);
    });
  };

  const winingOrderList = () => {
    if (winningOrder.length == 0) {
      return null;
    }

    // newWiningOrder filter by include segments
    const newWiningOrder = winningOrder.filter((segment) =>
      segments.includes(segment)
    );

    setWinningOrder(newWiningOrder);
    socket.emit("setWinningOrder", newWiningOrder);

    const wining = newWiningOrder[0];
    return wining;
  };

  const initData = () => {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
      "https://fonts.googleapis.com/css?family=Quicksand&display=swap";
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  useEffect(() => {
    calculateGlobalFontSize();
    draw();
  }, [segments]);

  const wheelInit = () => {
    initCanvas();
    draw();
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
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

        // Ensure the final segment is correct
        const finalSegmentIndex = Math.floor(
          segments.length -
            (((targetAngle / (Math.PI * 2)) * segments.length) %
              segments.length)
        );
        const finalSegment = segments[finalSegmentIndex];
        setCurrentSegment(finalSegment);

        if (finalSegment == winingOrderList()) {
          console.log("You win!");
          //remove wining segment from list winingOrder
          const newWiningOrder = winningOrder.filter(
            (segment) => segment !== finalSegment
          );
          setWinningOrder(newWiningOrder);
          socket.emit("setWinningOrder", newWiningOrder);
        }

        console.log("Finished spinning", finalSegment);
      } else {
        // Easing function for smooth deceleration
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        const newAngleCurrent = targetAngle * easedProgress;
        setAngleCurrent(newAngleCurrent);

        // Calculate the current segment
        const segmentAngle = (Math.PI * 2) / segments.length;
        const normalizedAngle =
          ((newAngleCurrent % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
        const newSegment = segments[segments.length - 1 - segmentIndex];

        setCurrentSegment(newSegment);
      }
    }, 20);
  };

  const getTargetAngle = () => {
    const numberOfSegments = segments.length;
    const segmentAngle = (Math.PI * 2) / numberOfSegments;

    let targetIndex;
    if (winingOrderList()) {
      targetIndex = segments.indexOf(winingOrderList());
      if (targetIndex === -1) {
        targetIndex = Math.floor(Math.random() * numberOfSegments);
      }
    } else {
      targetIndex = Math.floor(Math.random() * numberOfSegments);
    }

    // Calculate the base angle to rotate so that the target segment is at the top
    const baseAngle = (numberOfSegments - targetIndex - 0.5) * segmentAngle;

    // Add a small random offset within the segment (between -0.2 and 0.2 of a segment)
    // This is smaller than before to ensure we don't accidentally land on the wrong segment
    const randomOffset = (Math.random() - 0.5) * 0.4 * segmentAngle;

    // Add extra rotations for a more dramatic effect
    const extraRotations = Math.PI * 10; // 5 full rotations

    return baseAngle + randomOffset + extraRotations;
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

    ctx.font = `bold ${globalFontSize}px ${fontFamily}`;
    //elipsis
    ctx.fillText(
      value.length > 15 ? value.substring(0, 13) + "..." : value,
      size / 2 + 135,
      0
    );
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
    ctx.lineWidth = 1;
    ctx.fillStyle = "#BBBBBB";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(centerX + size - 20, centerY);
    ctx.lineTo(centerX + size + 20, centerY - 20);
    ctx.lineTo(centerX + size + 20, centerY + 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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
        onClick={spin}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto",
          width: "100%",
        }}
      />
    </div>
  );
};

export default Spin;
