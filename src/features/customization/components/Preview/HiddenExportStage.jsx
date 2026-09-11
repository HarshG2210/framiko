import { Image as KonvaImage, Layer, Rect, Stage } from "react-konva";

import { normalizeMediaUrl } from "../../../../utils/constant";
import { useFrameBorder } from "../../hooks/useFrameBorder";
import useImage from "use-image";
import { useSelector } from "react-redux";

const ORIENTATION_SIZE = {
  portrait: { w: 700, h: 950 },
  landscape: { w: 950, h: 700 },
  square: { w: 800, h: 800 },
};

const CM_TO_PX = 8;

const HiddenExportStage = () => {
  const {
    uploadedImage,
    selectedFrame,
    showFrame,
    imageTransform,
    imageOrientation,
    selectedSize,
    selectedBackground,
    frameViewChoice,
  } = useSelector((s) => s.framePreview);

  const variant = selectedBackground ? "wall" : "regular";
  const { borderWidth, borderSlice } = useFrameBorder(
    selectedFrame,
    showFrame,
    variant,
  );

  const selectedSizeWidth = selectedSize
    ? Number(selectedSize.width_cm) * CM_TO_PX
    : null;
  const selectedSizeHeight = selectedSize
    ? Number(selectedSize.height_cm) * CM_TO_PX
    : null;

  const { w, h } =
    selectedBackground && selectedSize
      ? { w: selectedSizeWidth, h: selectedSizeHeight }
      : ORIENTATION_SIZE[imageOrientation] || ORIENTATION_SIZE.square;

  const artworkUrl =
    typeof uploadedImage === "string" ? uploadedImage : uploadedImage?.image;
  const frameUrl = selectedFrame?.image;
  const [artwork] = useImage(normalizeMediaUrl(artworkUrl), "anonymous");
  const [frame] = useImage(normalizeMediaUrl(frameUrl), "anonymous");

  if (!artwork) return null;

  const stageWidth = w + borderWidth * 2;
  const stageHeight = h + borderWidth * 2;
  const sliceValue = Number(borderSlice) || 0;
  const frameWidth = frame?.width || 0;
  const frameHeight = frame?.height || 0;
  const innerFrameWidth = Math.max(0, frameWidth - sliceValue * 2);
  const innerFrameHeight = Math.max(0, frameHeight - sliceValue * 2);
  const hasFrameBorder =
    frame && showFrame && sliceValue > 0 && borderWidth > 0 && frameWidth > 0;
  const matGap = frameViewChoice === "moult" ? 28 : 0;

  return (
    <div style={{ display: "none" }}>
      <Stage id="export-stage" width={stageWidth} height={stageHeight}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fill="white"
          />
          <Rect
            x={borderWidth}
            y={borderWidth}
            width={w}
            height={h}
            fill="white"
          />
          <KonvaImage
            image={artwork}
            x={borderWidth + matGap}
            y={borderWidth + matGap}
            width={Math.max(0, w - matGap * 2)}
            height={Math.max(0, h - matGap * 2)}
            rotation={imageTransform.rotate}
          />
          {hasFrameBorder && (
            <>
              <KonvaImage
                image={frame}
                crop={{ x: 0, y: 0, width: sliceValue, height: sliceValue }}
                x={0}
                y={0}
                width={borderWidth}
                height={borderWidth}
              />
              <KonvaImage
                image={frame}
                crop={{
                  x: frameWidth - sliceValue,
                  y: 0,
                  width: sliceValue,
                  height: sliceValue,
                }}
                x={stageWidth - borderWidth}
                y={0}
                width={borderWidth}
                height={borderWidth}
              />
              <KonvaImage
                image={frame}
                crop={{
                  x: 0,
                  y: frameHeight - sliceValue,
                  width: sliceValue,
                  height: sliceValue,
                }}
                x={0}
                y={stageHeight - borderWidth}
                width={borderWidth}
                height={borderWidth}
              />
              <KonvaImage
                image={frame}
                crop={{
                  x: frameWidth - sliceValue,
                  y: frameHeight - sliceValue,
                  width: sliceValue,
                  height: sliceValue,
                }}
                x={stageWidth - borderWidth}
                y={stageHeight - borderWidth}
                width={borderWidth}
                height={borderWidth}
              />
              <KonvaImage
                image={frame}
                crop={{
                  x: sliceValue,
                  y: 0,
                  width: innerFrameWidth,
                  height: sliceValue,
                }}
                x={borderWidth}
                y={0}
                width={w}
                height={borderWidth}
              />
              <KonvaImage
                image={frame}
                crop={{
                  x: sliceValue,
                  y: frameHeight - sliceValue,
                  width: innerFrameWidth,
                  height: sliceValue,
                }}
                x={borderWidth}
                y={stageHeight - borderWidth}
                width={w}
                height={borderWidth}
              />
              <KonvaImage
                image={frame}
                crop={{
                  x: 0,
                  y: sliceValue,
                  width: sliceValue,
                  height: innerFrameHeight,
                }}
                x={0}
                y={borderWidth}
                width={borderWidth}
                height={h}
              />
              <KonvaImage
                image={frame}
                crop={{
                  x: frameWidth - sliceValue,
                  y: sliceValue,
                  width: sliceValue,
                  height: innerFrameHeight,
                }}
                x={stageWidth - borderWidth}
                y={borderWidth}
                width={borderWidth}
                height={h}
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default HiddenExportStage;
