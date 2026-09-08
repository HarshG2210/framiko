// src/components/FramesPreview/hooks/useExportFrame.js
import html2canvas from "html2canvas";

export const exportFramedImage = async ({ previewRef, frameImage }) => {
  const canvas = await html2canvas(previewRef.current, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    allowTaint: false,
  });

  if (frameImage) {
    const ctx = canvas.getContext("2d");
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = frameImage;

    await new Promise((res) => (frameImg.onload = res));
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  }

  return canvas.toDataURL("image/png");
};
