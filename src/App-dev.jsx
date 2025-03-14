// App-dev.jsx
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ARCanvas, ARAnchor } from "./components/AR";
import { Experience } from "./components/Experience";
import { OrbitControls } from "@react-three/drei";

function App() {
  const container = useRef();
  const [showExperience, setShowExperience] = useState(true);

  const toggleView = () => {
    setShowExperience((prev) => !prev);
  };

  return (
    <>
      {/* Botón para cambiar entre vistas */}
      <button
        onClick={toggleView}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
        }}
      >
        {showExperience ? "Mostrar AR" : "Mostrar Experience"}
      </button>

      {showExperience ? (
        // Vista Experience a pantalla completa
        <Canvas
          style={{ width: "100%", height: "100vh" }}
          shadows
          camera={{ position: [3, 3, 3], fov: 30 }}
        >
          <color attach="background" args={["#ececec"]} />
          <OrbitControls/>
          <Experience />
        </Canvas>
      ) : (
        // Vista AR a pantalla completa
        <div
          id="canvas-container"
          ref={container}
          style={{
            width: "100%",
            height: "100vh",
            overflow: "hidden", 
          }}
        >
          <ARCanvas
            container={container}
            imageTargets="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind"
          >
            <ARAnchor>
              <Experience/>
            </ARAnchor>
          </ARCanvas>
        </div>
      )}
    </>
  );
}

export default App;
