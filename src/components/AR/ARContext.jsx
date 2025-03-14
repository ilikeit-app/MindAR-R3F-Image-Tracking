import { createContext, useContext, useMemo } from "react";
import { Matrix4 } from "three";
import { atom } from "jotai";

// Contexto para compartir el estado de AR entre componentes
export const ARContext = createContext();

// Atom para manejar el estado de los anclajes
export const anchorsAtom = atom({});

// Matriz invisible para cuando el objetivo no es detectado
export const invisibleMatrix = new Matrix4().set(
  0, 0, 0, 0, 
  0, 0, 0, 0, 
  0, 0, 0, 0, 
  0, 0, 0, 1
);

// Hook para acceder al contexto de AR
export const useAR = () => {
  const arValue = useContext(ARContext);
  return useMemo(() => ({ ...arValue }), [arValue]);
};
