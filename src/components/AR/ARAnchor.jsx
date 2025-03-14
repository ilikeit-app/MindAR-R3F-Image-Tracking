// /components/AR/ARAnchor.jsx
import { useEffect, useRef } from "react";
import { Matrix4 } from "three";
import { useAtomValue, useSetAtom } from "jotai";
import { useAR, anchorsAtom, anchorStatusAtom } from "./ARContext";

function ARAnchor({ children, target = 0, onAnchorFound, onAnchorLost }) {
  const { controller } = useAR();
  const ref = useRef();
  const anchor = useAtomValue(anchorsAtom);
  const setAnchorStatus = useSetAtom(anchorStatusAtom); // Nuevo: actualizar estado global
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
      const isAnchorLost = (arr) =>
        Array.isArray(arr) && arr.every((val) => val === 0 || val === 1);
      if (anchor[target] && !isAnchorLost(anchor[target])) {
        if (!prevAnchorState.current) {
          console.log("Anchor found, calling onAnchorFound");
          setAnchorStatus(true); // Actualiza el estado global a true
          if (onAnchorFound) onAnchorFound();
        }
        prevAnchorState.current = true;
      } else {
        if (prevAnchorState.current) {
          console.log("Anchor lost, calling onAnchorLost");
          setAnchorStatus(false); // Actualiza el estado global a false
          if (onAnchorLost) onAnchorLost();
        }
        prevAnchorState.current = false;
      }
    }
  }, [controller, anchor, target, onAnchorFound, onAnchorLost, setAnchorStatus]);

  return (
    <group ref={ref} visible={false} matrixAutoUpdate={false}>
      {children}
    </group>
  );
}

export default ARAnchor;
