import { useEffect, useRef } from "react";
import { Matrix4 } from "three";
import { useAtomValue } from "jotai";
import { useAR, anchorsAtom } from "./ARContext";

function ARAnchor({ children, target = 0, onAnchorFound, onAnchorLost }) {
  const { controller } = useAR();
  const ref = useRef();
  const anchor = useAtomValue(anchorsAtom);
  const prevAnchorState = useRef(false); // Para rastrear el estado anterior

  useEffect(() => {
    if (ref.current) {
      if (controller.inputWidth === 0) {
        return;
      }
      if (anchor[target]) {
        ref.current.visible = true;
        ref.current.matrix = new Matrix4().fromArray(anchor[target]);
      } else {
        ref.current.visible = false;
      }
    }
  }, [controller, anchor, target]);

  useEffect(() => {
    if (ref.current) {
      if (controller.inputWidth === 0) {
        return;
      }
      const isAnchorLost = (arr) => Array.isArray(arr) && arr.every(val => val === 0 || val === 1);
      if (anchor[target] && !isAnchorLost(anchor[target])) {
        if (!prevAnchorState.current) {
          console.log("Anchor found, calling onAnchorFound");
          if (onAnchorFound) onAnchorFound();
        }
        prevAnchorState.current = true;
      } else {
        if (prevAnchorState.current) {
          console.log("Anchor lost, calling onAnchorLost");
          if (onAnchorLost) onAnchorLost();
        }
        prevAnchorState.current = false;
      }
    }
  }, [controller, anchor, target, onAnchorFound, onAnchorLost]);

  return (
    <group ref={ref} visible={false} matrixAutoUpdate={false}>
      {children}
    </group>
  );
}

export default ARAnchor;
