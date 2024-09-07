"use client";
import React, { useEffect, useState, useRef } from "react";
import "../globals.css";
import { socket } from "../socker";
import { controllerStore } from "../store/controllerStore";
import WinnerPopup from "./Wining";

const Spin = ({ primaryColor, contrastColor, isOnlyOnce = true }) => {
  const fontFamily = "Quicksand";
  const { setSpining, duration } = controllerStore();
  const [segments, setSegments] = useState([]);
  const audioRef = useRef(null);
  const audioEndRef = useRef(null);
  const [segColors, setSegColors] = useState([]);
  const listColors = ["#009925", "#D61024", "#EEB212", "#3369E8"];
  const [currentSegment, setCurrentSegment] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const canvasRef = useRef(null);
  const needleCanvasRef = useRef(null); // New ref for the needle canvas
  const idleIntervalRef = useRef(null);
  const [winningOrder, setWinningOrder] = useState([]);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  const [angleCurrent, setAngleCurrent] = useState(0);
  const size = 300; // Logical size, not physical
  const centerX = size;
  const centerY = size;
  const [globalFontSize, setGlobalFontSize] = useState(40);

  const playTickSound = () => {
    const canPlay = audioRef.current.canPlayType("audio/mpeg");
    if (canPlay === "") {
      console.log("Browser cannot play this audio format.");
      return;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.error("Error playing audio", error);
    });
  };

  const playEndSound = () => {
    const canPlay = audioEndRef.current.canPlayType("audio/mpeg");
    if (canPlay === "") {
      console.log("Browser cannot play this audio format.");
      return;
    }
    audioEndRef.current.currentTime = 0;
    audioEndRef.current.play().catch((error) => {
      console.error("Error playing audio", error);
    });
  };

  const calculateGlobalFontSize = () => {
    const canvas = canvasRef.current;
    if (canvas && segments.length > 0) {
      const ctx = canvas.getContext("2d");
      const availableWidth = size / 2 + 60;
      let fontSize = 60;

      ctx.font = `bold ${fontSize}px ${fontFamily}, sans-serif`;

      const longestText = segments.reduce((a, b) =>
        a.length > b.length ? a : b
      );

      let textWidth = ctx.measureText(longestText).width;

      // Adjust font size based on number of segments
      const segmentAdjustment = Math.max(1, Math.log2(segments.length) * 0.5);
      fontSize = Math.min(fontSize, fontSize / segmentAdjustment);

      while (textWidth > availableWidth && fontSize > 20) {
        fontSize--;
        ctx.font = `bold ${fontSize}px ${fontFamily}, sans-serif`;
        textWidth = ctx.measureText(longestText).width;
      }

      setGlobalFontSize(Math.floor(fontSize));
    }
  };

  useEffect(() => {
    wheelInit();
    fetchSegments();
    audioRef.current = new Audio("/ding.mp3");
    audioEndRef.current = new Audio("/end.mp3");

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

  useEffect(() => {
    calculateGlobalFontSize();
    draw();
  }, [segments]);

  const wheelInit = () => {
    draw();
  };

  const stopIdleSpin = () => {
    clearInterval(idleIntervalRef.current);
  };

  const spinWheel = () => {
    if (isStarted) return;
    setIsStarted(true);
    setSpining(true);
    stopIdleSpin();
    setAngleCurrent(0);

    const totalDuration = duration * 1000;
    const startTime = new Date().getTime();

    const targetAngle = getTargetAngle();
    const totalRotations = 10 + segments.length / 2;

    let lastSegment = "";

    const spinInterval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - startTime;
      let progress = elapsed / totalDuration;

      if (progress >= 1) {
        progress = 1;
        clearInterval(spinInterval);
        setFinished(true);
        setIsStarted(false);
        setSpining(false);

        const finalSegmentIndex = Math.floor(
          segments.length -
            (((targetAngle / (Math.PI * 2)) * segments.length) %
              segments.length)
        );
        const finalSegment = segments[finalSegmentIndex];
        setCurrentSegment(finalSegment);

        if (finalSegment === winingOrderList()) {
          const newWiningOrder = winningOrder.filter(
            (segment) => segment !== finalSegment
          );
          setWinningOrder(newWiningOrder);
          socket.emit("setWinningOrder", newWiningOrder);
        }

        setTimeout(() => {
          setShowWinnerPopup(true);
          socket.emit("addResult", finalSegment);
          playEndSound();
        }, 1500);
      } else {
        const customEasing = (t) => {
          if (t < 0.1) {
            console.log(t);
            return 2 * t * (duration * (t * 10));
          } else {
            return 1 - (Math.pow(-2 * t + 2, 2) / 2) * (duration / (t * 100));
          }
        };

        const easedProgress = customEasing(progress);

        const newAngleCurrent = targetAngle * easedProgress;
        setAngleCurrent(newAngleCurrent);

        const segmentAngle = (Math.PI * 2) / segments.length;
        const normalizedAngle =
          ((newAngleCurrent % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
        const newSegment = segments[segments.length - 1 - segmentIndex];

        if (newSegment !== lastSegment) {
          playTickSound();
          lastSegment = newSegment;
        }

        setCurrentSegment(newSegment);
      }
    }, 16);
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

    const baseAngle = (numberOfSegments - targetIndex - 0.5) * segmentAngle;
    const randomOffset = (Math.random() - 0.5) * 0.8 * segmentAngle;
    const extraRotations = Math.PI * 10;

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
    ctx.fillStyle = ["#009925", "#EEB212"].includes(segColors[key])
      ? "black"
      : "white";
    ctx.font = `bold ${globalFontSize}px ${fontFamily}, sans-serif`;
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

    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = primaryColor || "white";
    ctx.lineWidth = 5;
    ctx.strokeStyle = contrastColor || "white";
    ctx.fill();
    ctx.stroke();
  };

  const getCurrentColorBySegment = (segment) => {
    const index = segments.indexOf(segment);
    return segColors[index];
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

  const drawNeedle = () => {
    const canvas = needleCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
  
      // Set up the needle canvas
      const scale = window.devicePixelRatio || 1;
      canvas.width = 150 * scale; // Increased width to allow more space for the needle
      canvas.height = size * 2 * scale; // Match the height of the wheel canvas
      ctx.scale(scale, scale);
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Adjust the translation to center the needle properly
      ctx.translate(75, size); // Center horizontally within the new width
  
      // Rotate the needle 180 degrees to point it in the correct direction
      ctx.save(); // Save the current state of the context
      const rotationAngle = Math.PI; // 180 degrees rotation
      ctx.rotate(rotationAngle); // Rotate the needle 180 degrees
  
      // Draw the needle
      ctx.beginPath();
      ctx.moveTo(0, -25); // Adjust start position for a proper look
      ctx.lineTo(50, 0); // Extend further to make the needle fully visible
      ctx.lineTo(0, 25); // Bottom of the needle
      ctx.closePath();
      ctx.fillStyle = "#BBBBBB";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
  
      ctx.restore(); // Restore the context to the state before rotation
    }
  };
  

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set canvas scale for high DPI screens
      const scale = window.devicePixelRatio || 1;
      canvas.width = size * 2 * scale;
      canvas.height = size * 2 * scale;
      ctx.scale(scale, scale);

      drawWheel(ctx);
      drawNeedle(ctx);
    }
  };

  const handleClosePopup = () => {
    setShowWinnerPopup(false);
  };

  const handleRemoveWinner = () => {
    const newSegments = segments.filter(
      (segment) => segment !== currentSegment
    );
    setSegments(newSegments);
    socket.emit("updateEntries", newSegments);
    setShowWinnerPopup(false);
  };

  useEffect(() => {
    draw();
  }, [angleCurrent, currentSegment]);

  return (
    <div id="wheel" className="relative">
      <canvas
        ref={canvasRef}
        className="roboto-medium pr-10"
        id="canvas"
        width="700"
        height="700"
        onClick={spinWheel}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto",
          width: "100%",
        }}
      />
      <canvas
        ref={needleCanvasRef}
        className="needle-canvas -right-12"
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <WinnerPopup
        color={getCurrentColorBySegment(currentSegment)}
        winner={currentSegment}
        onClose={handleClosePopup}
        onRemove={handleRemoveWinner}
        isVisible={showWinnerPopup}
      />
    </div>
  );
};

export default Spin;
