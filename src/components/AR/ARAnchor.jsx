// /components/AR/ARAnchor.jsx
import { useEffect, useRef } from "react";
import { Matrix4, Vector3, Quaternion } from "three";
import { useAtomValue, useSetAtom } from "jotai";
import { useFrame } from "@react-three/fiber";
import { useAR, anchorsAtom, anchorStatusAtom, invisibleMatrix } from "./ARContext";

function ARAnchor({
  children,
  target = 0,
  dampingMultiplier, // Prop para controlar el suavizado (damping). 
                       // Si se proporciona, se aplica interpolación; 
                       // si es undefined, se asigna la transformación directamente (comportamiento por defecto).
  onAnchorFound,
  onAnchorLost,
}) {
  const { controller } = useAR();
  const groupRef = useRef();
  const anchor = useAtomValue(anchorsAtom);
  const setAnchorStatus = useSetAtom(anchorStatusAtom);
  const prevAnchorState = useRef(false);

  // Objeto para almacenar la transformación previa (posición, rotación y escala)
  const prevTransform = useRef({
    pos: new Vector3(),
    quat: new Quaternion(),
    scale: new Vector3(1, 1, 1),
    initialized: false,
  });

  // Objeto para componer la matriz objetivo
  const targetMatrix = useRef(new Matrix4());

  // Función auxiliar para determinar si el anchor está perdido.
  // Se considera perdido si no hay datos o si el array tiene únicamente 0 o 1.
  const isAnchorLost = (arr) =>
    !arr || (Array.isArray(arr) && arr.every((val) => val === 0 || val === 1));

  // Se utiliza useFrame para actualizar la transformación en cada frame
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (controller.inputWidth === 0) return;

    // Si no hay datos válidos o el anchor se considera perdido, se oculta y se reinicia la transformación.
    if (!anchor[target] || isAnchorLost(anchor[target])) {
      groupRef.current.visible = false;
      prevTransform.current.initialized = false;
      return;
    }

    // Se crea la nueva matriz a partir de los datos recibidos del tracking
    const newMatrix = new Matrix4().fromArray(anchor[target]);
    const newPos = new Vector3();
    const newQuat = new Quaternion();
    const newScale = new Vector3();
    newMatrix.decompose(newPos, newQuat, newScale);

    if (!prevTransform.current.initialized) {
      // Primera detección o tras reinicio: se asignan directamente los nuevos valores.
      prevTransform.current.pos.copy(newPos);
      prevTransform.current.quat.copy(newQuat);
      prevTransform.current.scale.copy(newScale);
      prevTransform.current.initialized = true;
    } else {
      // Si se ha proporcionado dampingMultiplier, se aplica interpolación (suavizado).
      // Se calcula un factor 't' en función del delta y el dampingMultiplier:
      //   t = 1 - exp(-delta * dampingMultiplier)
      // Valores más altos en dampingMultiplier generan una respuesta más rápida (menos damping),
      // mientras que valores más bajos generan un suavizado mayor (más damping).
      if (dampingMultiplier != null) {
        const t = 1 - Math.exp(-delta * dampingMultiplier);
        prevTransform.current.pos.lerp(newPos, t);
        prevTransform.current.quat.slerp(newQuat, t);
        prevTransform.current.scale.lerp(newScale, t);
      } else {
        // Si dampingMultiplier no se proporciona (undefined), se asignan los valores directamente,
        // manteniendo el comportamiento original sin interpolación.
        prevTransform.current.pos.copy(newPos);
        prevTransform.current.quat.copy(newQuat);
        prevTransform.current.scale.copy(newScale);
      }
    }

    // Se compone la matriz a partir de los valores (ya sea interpolados o asignados directamente)
    targetMatrix.current.compose(
      prevTransform.current.pos,
      prevTransform.current.quat,
      prevTransform.current.scale
    );
    groupRef.current.matrix.copy(targetMatrix.current);
    groupRef.current.visible = true;
  });

  // Efecto para notificar cuando se detecta (target found) o se pierde (target lost) el anchor
  useEffect(() => {
    if (!groupRef.current) return;
    if (controller.inputWidth === 0) return;

    if (anchor[target] && !isAnchorLost(anchor[target])) {
      if (!prevAnchorState.current) {
        console.log("Anchor found, calling onAnchorFound");
        setAnchorStatus(true);
        if (onAnchorFound) onAnchorFound();
      }
      prevAnchorState.current = true;
    } else {
      if (prevAnchorState.current) {
        console.log("Anchor lost, calling onAnchorLost");
        setAnchorStatus(false);
        if (onAnchorLost) onAnchorLost();
      }
      prevAnchorState.current = false;
    }
  }, [controller, anchor, target, onAnchorFound, onAnchorLost, setAnchorStatus]);

  return (
    <group ref={groupRef} visible={false} matrixAutoUpdate={false}>
      {children}
    </group>
  );
}

export default ARAnchor;
