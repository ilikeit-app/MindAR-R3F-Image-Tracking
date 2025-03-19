# MindAR+R3F Image Tracking

This project arises from the need to integrate MindAR with React Three Fiber (R3F). I would like to express my gratitude to the following people and repositories that made this integration possible:

- **MindAR:** Thanks to the creators of [MindAR](https://github.com/hiukim/mind-ar-js) for providing robust AR functionality.
- **react-three-mind:** Thanks to the creator of [react-three-mind](https://github.com/tommasoturchi/react-three-mind) for kickstarting my journey with this integration.
- **Community Inspiration:** Thanks to the [pull request comment](https://github.com/tommasoturchi/react-three-mind/pull/18#issuecomment-1896810306) on react-three-mind, I got to know the user [Darkensses](https://github.com/Darkensses).
- **Special Thanks to Darkensses:** His repository [react-three-mind-experiment](https://github.com/Darkensses/react-three-mind-experiment) allowed me to refactor the code and implement improvements to reduce jittering. 

---

This project is a React application built with Vite that demonstrates augmented reality (AR) image tracking using MindAR and React Three Fiber (R3F). It leverages several libraries such as **three.js** for 3D rendering, **@react-three/fiber** for integrating three.js with React, **mind-ar** for image target tracking, **react-webcam** for real-time video capture, and **jotai** for state management.

https://github.com/user-attachments/assets/ef9d89cd-914b-4119-9668-012c79ba6a65

## Features

- **Augmented Reality (AR):** Tracks image targets using MindAR and overlays 3D objects accordingly.
- **3D Rendering:** Utilizes three.js along with React Three Fiber to create and update 3D scenes.
- **Webcam Integration:** Captures live video feed using react-webcam.
- **State Management:** Uses jotai for efficient and reactive state handling of AR anchors.
- **Responsive Design:** Dynamically adjusts the camera and video feed based on container size.
- **Fast Development:** Built with Vite for a modern, fast development experience.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Code Overview](#code-overview)
- [Dependencies](#dependencies)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher is recommended)
- npm or yarn

### Cloning the Repository

Clone the repository and navigate into the project folder:

```bash
git clone https://github.com/yourusername/mindar-r3f-image-tracking.git  
cd mindar-r3f-image-tracking
```

### Installing Dependencies

Install the project dependencies using npm or yarn:

```bash
npm install  
# or  
yarn install
```

## Usage

### Running the Development Server

Start the application in development mode with the following command:

```bash
npm run dev  
# or  
yarn dev
```

Then, open your browser and navigate to [http://localhost:3000](http://localhost:3000) (or the port indicated by Vite) to view the application.

## Project Structure

- **src/App.jsx:** Main component that integrates the ARCanvas and ARAnchor, rendering a sample 3D plane.
- **src/components/AR.jsx:** Contains the primary AR logic, including MindAR controller setup, video adjustments, and anchor updates.
- **src/components/ARAnchor.jsx:** Manages individual AR anchors, showing or hiding 3D objects based on image target detection.
- **src/components/ARCanvas.jsx:** Combines the @react-three/fiber Canvas with an overlayed webcam video feed.

## Code Overview

The core AR functionality is implemented in the **AR** component. Key functions include:

- **Controller Initialization:** Configures the MindAR controller with the webcam video dimensions and custom parameters (e.g., filters and tolerances).
- **Dynamic Adjustment:** Calculates and updates the camera projection matrix to align the video feed and 3D scene based on the container size.
- **Anchor Updates:** Uses jotai to update and manage the transformation matrices for detected image targets, ensuring the correct positioning of 3D objects.

Example usage in **App.jsx**:

```jsx
import React, { useRef } from "react";
import ARCanvas from "./components/ARCanvas";
import ARAnchor from "./components/ARAnchor";
import Plane from "./components/Plane"; // Ensure this component is defined or adjust the import accordingly

function App() {
  const container = useRef(null);

  return (
    <div
      id="canvas-container"
      ref={container}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
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
```

Make sure that the components **ARCanvas**, **ARAnchor**, and **Plane** are correctly implemented in your project. This snippet now includes all the essential parts for the example usage to work properly.

## Dependencies

- **React:** The core library for building the user interface.
- **Vite:** A modern, fast build tool for development.
- **three.js:** A 3D library used for rendering and matrix operations.
- **@react-three/fiber:** A React renderer for three.js.
- **mind-ar:** Provides the AR image tracking functionality.
- **react-webcam:** Captures live webcam video.
- **jotai:** Manages state for AR anchors.

## Customization

- **Image Targets:** Change the URL in the `imageTargets` property of the **ARCanvas** component to use your own AR marker.
- **3D Content:** Replace or extend the **Plane** component within **ARAnchor** to render different 3D models or objects.
- **Camera Settings:** Adjust the `resize` function in the **AR** component to fine-tune camera parameters according to your requirements.

## Troubleshooting

- **Webcam Permissions:** Ensure that your browser has permission to access the camera.
- **Target Format:** Verify that the image target URL is accessible and formatted correctly.
- **Browser Console:** Check the browser console for errors or warnings to help identify issues during development.
- **Cross-Browser Compatibility:** Test the application on different browsers and devices to ensure optimal performance.

## License

This project is distributed under the [MIT License](LICENSE).

## Acknowledgments

- [MindAR](https://hiukim.github.io/mind-ar-js-doc/) for providing robust AR functionalities.
- [three.js](https://threejs.org/) for their powerful 3D rendering library.
- [Vite](https://vitejs.dev/) for delivering an efficient development environment.
- **Special thanks to [Darkensses](https://github.com/Darkensses) for his invaluable contributions and his invaluable contribution and support.**
