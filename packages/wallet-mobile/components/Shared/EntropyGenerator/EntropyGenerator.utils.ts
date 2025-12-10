import { SHA256 } from "crypto-js";
import Hex from "crypto-js/enc-hex";

/**
 * Update seed with new entropy from mouse movements, will limit the length to 64 characters
 */
export const updateSeed = (
  currentSeed: string,
  currX: number,
  currY: number
): string => {
  const randomPart = (currX * currY * Math.random())
    .toString(36)
    .substring(2, 8);
  let newSeed = currentSeed + randomPart;

  // Only keep a limited length
  if (newSeed.length > 64) {
    newSeed = newSeed.slice(-64);
  }
  return SHA256(newSeed).toString(Hex);
};

/**
 * Draws a glowing white Mandala pattern on the canvas based on the user's mouse movements.
 */
export const drawPattern = (
  currX: number,
  currY: number,
  prevX: number,
  prevY: number,
  width: number,
  height: number,
  ctx: any
) => {
  // Initialise
  const a = prevX,
    b = prevY,
    c = currX,
    d = currY;
  let a_ = a,
    b_ = height - b,
    c_ = c,
    d_ = height - d;

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3; // Increased from 4 to 3 for smoother appearance
  ctx.lineCap = "round";
  ctx.lineJoin = "round"; // Added for smoother corners

  ctx.beginPath();

  ctx.moveTo(a, b);
  ctx.lineTo(c, d);

  ctx.moveTo(a_, b_);
  ctx.lineTo(c_, d_);

  a_ = width - a;
  b_ = b;
  c_ = width - c;
  d_ = d;
  ctx.moveTo(a_, b_);
  ctx.lineTo(c_, d_);

  a_ = width - a;
  b_ = height - b;
  c_ = width - c;
  d_ = height - d;
  ctx.moveTo(a_, b_);
  ctx.lineTo(c_, d_);

  a_ = width / 2 + height / 2 - b;
  b_ = width / 2 + height / 2 - a;
  c_ = width / 2 + height / 2 - d;
  d_ = width / 2 + height / 2 - c;
  ctx.moveTo(a_, b_);
  ctx.lineTo(c_, d_);

  a_ = width / 2 + height / 2 - b;
  b_ = height / 2 - width / 2 + a;
  c_ = width / 2 + height / 2 - d;
  d_ = height / 2 - width / 2 + c;
  ctx.moveTo(a_, b_);
  ctx.lineTo(c_, d_);

  a_ = width / 2 - height / 2 + b;
  b_ = width / 2 + height / 2 - a;
  c_ = width / 2 - height / 2 + d;
  d_ = width / 2 + height / 2 - c;
  ctx.moveTo(a_, b_);
  ctx.lineTo(c_, d_);

  a_ = width / 2 - height / 2 + b;
  b_ = height / 2 - width / 2 + a;
  c_ = width / 2 - height / 2 + d;
  d_ = height / 2 - width / 2 + c;
  ctx.moveTo(a_, b_);
  ctx.lineTo(c_, d_);

  ctx.stroke();
  ctx.closePath();
};

/**
 * Fades out older lines on the canvas by reducing the opacity of non-black pixels.
 */
export const fadeOut = (ctx: any, width: number, height: number) => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
  ctx.fillRect(0, 0, width, height);
};

/**
 * Reset and clear the canvas
 */
export const resetCanvas = (ctx: any, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height);
  // Fill with black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
};
