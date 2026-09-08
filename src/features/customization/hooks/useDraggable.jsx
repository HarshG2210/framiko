// src/components/FramesPreview/hooks/useDraggable.js
import { useRef, useState } from "react";

export const useDraggable = () => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 600, y: 350 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onMouseUp = () => setDragging(false);

  return {
    ref,
    position,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
};
