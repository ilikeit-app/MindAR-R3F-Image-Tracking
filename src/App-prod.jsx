// App-prod.jsx
import { useRef } from "react";
import { ARCanvas, ARAnchor } from "./components/AR";
import { Experience } from "./components/Experience";

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
  );
}

export default App;
