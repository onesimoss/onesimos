"use client";

import { useEffect, useRef } from "react";

interface AnalogClockProps {
  hour: number;
  minute: number;
}

export function AnalogClock({ hour, minute }: AnalogClockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 200;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 90;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#fcf9f5";
    ctx.fill();
    ctx.strokeStyle = "#1e1916";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw numbers
    for (let i = 1; i <= 12; i++) {
      const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
      const numX = centerX + (radius - 20) * Math.cos(angle);
      const numY = centerY + (radius - 20) * Math.sin(angle);
      ctx.fillStyle = "#1e1916";
      ctx.font = "16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(i.toString(), numX, numY);
    }

    // Draw hour hand
    const hourAngle = ((hour % 12) / 12) * 2 * Math.PI - Math.PI / 2 + (minute / 60) * (Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 45 * Math.cos(hourAngle), centerY + 45 * Math.sin(hourAngle));
    ctx.strokeStyle = "#1e1916";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw minute hand
    const minuteAngle = (minute / 60) * 2 * Math.PI - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 65 * Math.cos(minuteAngle), centerY + 65 * Math.sin(minuteAngle));
    ctx.strokeStyle = "#b28b6a";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#b28b6a";
    ctx.fill();

  }, [hour, minute]);

  return <canvas ref={canvasRef} width={200} height={200} />;
}