// ================= REGULAR =================
const REGULAR_FRAME_BORDER_MAP = {
  "0.50": { border: 100, slice: 48 },
  "1.00": { border: 100, slice: 96 },
  1.25: { border: 100, slice: 120 },
  "1.50": { border: 100, slice: 144 },
  1.75: { border: 100, slice: 168 },
  "2.00": { border: 100, slice: 192 },
  "2.50": { border: 100, slice: 244 },
  "3.00": { border: 100, slice: 288 },
  "3.50": { border: 100, slice: 336 },
  "4.00": { border: 100, slice: 385 },
  "4.50": { border: 100, slice: 330 },
};

// ================= WALL =================
const WALL_FRAME_BORDER_MAP = {
  "0.50": { border: 20, slice: 48 },
  "1.00": { border: 20, slice: 96 },
  1.25: { border: 20, slice: 120 },
  "1.50": { border: 20, slice: 144 },
  1.75: { border: 20, slice: 169 },
  "2.00": { border: 20, slice: 192 },
  "2.50": { border: 20, slice: 246 },
  "3.00": { border: 20, slice: 289 },
  "3.50": { border: 20, slice: 340 },
  "4.00": { border: 20, slice: 385 },
  "4.50": { border: 20, slice: 130 },
};

// ================= HERO =================
const HERO_FRAME_BORDER_MAP = {
  "0.50": { border: 25, slice: 120 },
  "1.00": { border: 25, slice: 120 },
  1.25: { border: 25, slice: 140 },
  "1.50": { border: 25, slice: 160 },
  1.75: { border: 25, slice: 176 },
  "2.00": { border: 25, slice: 190 },
  "2.50": { border: 25, slice: 220 },
  "3.00": { border: 25, slice: 260 },
  "3.50": { border: 25, slice: 300 },
  "4.00": { border: 25, slice: 340 },
  "4.50": { border: 25, slice: 380 },
};

// ================= WISHLIST =================
const WISHLIST_FRAME_BORDER_MAP = {
  "0.50": { border: 10, slice: 48 },
  "1.00": { border: 10, slice: 96 },
  1.25: { border: 11, slice: 121 },
  "1.50": { border: 12, slice: 145 },
  1.75: { border: 13, slice: 168 },
  "2.00": { border: 12, slice: 192 },
  "2.50": { border: 14, slice: 245 },
  "3.00": { border: 14, slice: 292 },
  "3.50": { border: 16, slice: 230 },
  "4.00": { border: 16, slice: 260 },
  "4.50": { border: 18, slice: 290 },
};

// ================= TRENDING NOW =================
const TRENDING_FRAME_BORDER_MAP = {
  "0.50": { border: 14, slice: 48 },
  "1.00": { border: 14, slice: 96 },
  1.25: { border: 14, slice: 120 },
  "1.50": { border: 14, slice: 144 },
  1.75: { border: 14, slice: 168 },
  "2.00": { border: 14, slice: 192 },
  "2.50": { border: 14, slice: 245 },
  "3.00": { border: 14, slice: 290 },
  "3.50": { border: 14, slice: 260 },
  "4.00": { border: 14, slice: 300 },
  "4.50": { border: 14, slice: 340 },
};

// ================= HOOK =================

export const useFrameBorder = (
  selectedFrame,
  showFrame,
  variant = "regular",
  isWishlist = false,
  isMobile = false,
) => {
  if (!showFrame || !selectedFrame) {
    return { borderWidth: 0, borderSlice: 0 };
  }

  let map;

  if (isWishlist) {
    map = WISHLIST_FRAME_BORDER_MAP;
  } else if (variant === "wall") {
    map = WALL_FRAME_BORDER_MAP;
  } else if (variant === "hero") {
    map = HERO_FRAME_BORDER_MAP;
  } else if (variant === "trending") {
    map = TRENDING_FRAME_BORDER_MAP;
  } else {
    map = REGULAR_FRAME_BORDER_MAP;
  }

  const thicknessKey = String(selectedFrame?.thickness ?? "2.00");
  const config = map[thicknessKey];

  // If we're on a small/mobile screen and using the regular map,
  // scale down the large regular border values to avoid overflow.
  if (isMobile && map === REGULAR_FRAME_BORDER_MAP) {
    // User requested slice scale = 1 on mobile. Keep slice but return
    // a much smaller borderWidth so the frame doesn't overflow the viewport.
    const sliceScale = 1;
    const mobileSlice = Math.max(
      48,
      Math.round((config?.slice ?? 180) * sliceScale),
    );

    // Make border small on mobile: take a small fraction of the configured border,
    // but cap it so it stays visible without causing overflow.
    const fraction = 0.75; // 75% of configured border (slightly larger)
    let mobileBorder = Math.max(
      4,
      Math.round((config?.border ?? 100) * fraction),
    );
    // increase cap so the frame is more prominent on small screens
    mobileBorder = Math.min(mobileBorder, 120);

    return {
      borderWidth: mobileBorder,
      borderSlice: mobileSlice,
    };
  }

  return {
    borderWidth: config?.border || 14,
    borderSlice: config?.slice || 180,
  };
};
