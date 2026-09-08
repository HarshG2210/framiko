/* -------------------------------
   Thickness Multiplier
-------------------------------- */
export const getThicknessMultiplier = (thickness) => {
  switch (thickness) {
    case "1.00":
      return 1.65;
    case "1.50":
      return 1.14;
    case "2.00":
      return 1.06;
    case "2.50":
    case "3.00":
      return 1.2;
    default:
      return 1;
  }
};

/* -------------------------------
     Border Width Calculator
  -------------------------------- */
export const calculateBorderWidth = ({
  previewWidth,
  previewHeight,
  imageWidth,
  imageHeight,
  baseThickness,
  frameThickness,
}) => {
  const dynamicBorder = Math.min(
    (previewWidth - imageWidth + baseThickness * 4.2) / 2,
    (previewHeight - imageHeight + baseThickness * 4.2) / 2
  );

  return dynamicBorder * getThicknessMultiplier(frameThickness);
};
