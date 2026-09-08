// ================= REGULAR =================
const REGULAR_FRAME_BORDER_MAP = {
  "0.50": { border: 100, slice: 48},
  "1.00": { border: 100, slice: 96 },
  "1.25": { border: 100, slice: 120 },
  "1.50": { border: 100, slice: 144 },
  "1.75": { border: 100, slice: 168 },
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
  "1.25": { border: 20, slice: 120 },
  "1.50": { border: 20, slice: 144 },
  "1.75": { border: 20, slice: 169 },
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
  "1.25": { border: 25, slice: 140 },
  "1.50": { border: 25, slice: 160 },
  "1.75": { border: 25, slice: 176 },
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
  "1.25": { border: 11, slice: 121 },
  "1.50": { border: 12, slice: 145 },
  "1.75": { border: 13, slice: 168 },
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
  "1.25": { border: 14, slice: 120 },
  "1.50": { border: 14, slice: 144 },
  "1.75": { border: 14, slice: 168 },
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
  isWishlist = false
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

  return {
    borderWidth: config?.border || 14,
    borderSlice: config?.slice || 180,
  };
};
