import { useRef } from "react";
import { ARCanvas, ARAnchor } from "./components/AR";

function Plane() {
  return (
    <mesh>
      <planeGeometry args={[1, 0.55]} />
      <meshBasicMaterial transparent color={0x0000ff} opacity={0.5} />
    </mesh>
  );
}

function App() {
  const container = useRef();
  return (
    <div
      id="canvas-container"
      ref={container}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden", // Evita que el feed de video se desborde
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <ARCanvas
        container={container}
        imageTargets="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind"
      >
        <ARAnchor>
          <Plane />
        </ARAnchor>
      </ARCanvas>
    </div>
  );
}

export default App;
