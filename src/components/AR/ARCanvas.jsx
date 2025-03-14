// /components/AR/ARCanvas.jsx
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Webcam from "react-webcam";
import AR from "./AR";

function ARCanvas({ children, arEnabled = true, imageTargets, container }) {
  const webcam = useRef();
  return (
    <>
      <Canvas>
        <AR imageTargets={imageTargets} webcam={webcam} container={container}>
          {children}
        </AR>
      </Canvas>
      <Webcam
        ref={webcam}
        videoConstraints={{facingMode:"environment"}}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -2,
        }}
      />
    </>
  );
}

export default ARCanvas;
