// /components/AR/AR.jsx
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Matrix4, Quaternion, Vector3 } from "three";
import { useThree } from "@react-three/fiber";
import { Controller as ImageTargetController } from "mind-ar/dist/mindar-image.prod";
import { useSetAtom } from "jotai";
import { ARContext, anchorsAtom, invisibleMatrix } from "./ARContext";

const AR = memo(function AR({
  children,
  imageTargets,
  filterMinCF = null,
  filterBeta = null,
  warmupTolerance = null,
  missTolerance = null,
  maxTrack,
  webcam,
  container,
}) {
  const { camera } = useThree();
  const [ready, setReady] = useState(false);
  const setAnchors = useSetAtom(anchorsAtom);

  const arContext = useMemo(() => {
    const controller = new ImageTargetController({
      inputWidth: webcam.current.video.videoWidth,
      inputHeight: webcam.current.video.videoHeight,
      filterMinCF,
      filterBeta,
      warmupTolerance,
      missTolerance,
      maxTrack,
    });
    return { controller };
    // Nota: Es importante que webcam.current.video esté definido.
  }, [
    filterMinCF,
    filterBeta,
    warmupTolerance,
    missTolerance,
    maxTrack,
    webcam.current.video.videoWidth,
    webcam.current.video.videoHeight,
  ]);

  const resize = useCallback(() => {
    const { controller } = arContext;

    let vw, vh; // display css width, height
    const videoRatio = webcam.current.video.videoWidth / webcam.current.video.videoHeight;
    const containerRatio = container.current.clientWidth / container.current.clientHeight;
    if (videoRatio > containerRatio) {
      vh = container.current.clientHeight;
      vw = vh * videoRatio;
    } else {
      vw = container.current.clientWidth;
      vh = vw / videoRatio;
    }
    const proj = controller.getProjectionMatrix();

    // Ajuste del input según la relación
    const inputRatio = controller.inputWidth / controller.inputHeight;
    let inputAdjust;
    if (inputRatio > containerRatio) {
      inputAdjust = webcam.current.video.width / controller.inputWidth;
    } else {
      inputAdjust = webcam.current.video.height / controller.inputHeight;
    }
    let videoDisplayHeight;
    let videoDisplayWidth;
    if (inputRatio > containerRatio) {
      videoDisplayHeight = container.current.clientHeight;
      videoDisplayHeight *= inputAdjust;
    } else {
      videoDisplayWidth = container.current.clientWidth;
      videoDisplayHeight = (videoDisplayWidth / controller.inputWidth) * controller.inputHeight;
      videoDisplayHeight *= inputAdjust;
    }
    let fovAdjust = container.current.clientHeight / videoDisplayHeight;
    const fov = (2 * Math.atan(1 / proj[5] * fovAdjust) * 180) / Math.PI; // vertical fov
    const near = proj[14] / (proj[10] - 1.0);
    const far = proj[14] / (proj[10] + 1.0);

    camera.fov = fov;
    camera.near = near;
    camera.far = far;
    camera.aspect = container.current.clientWidth / container.current.clientHeight;
    camera.updateProjectionMatrix();

    // Ajusta la posición del video para centrarlo en el contenedor
    webcam.current.video.style.top = (-(vh - container.current.clientHeight) / 2) + "px";
    webcam.current.video.style.left = (-(vw - container.current.clientWidth) / 2) + "px";
    webcam.current.video.style.width = vw + "px";
    webcam.current.video.style.height = vh + "px";
  }, [arContext, camera, container, webcam]);

  const onUmount = useCallback(() => {
    window.removeEventListener("resize", resize);
  }, [resize]);

  const startAR = useCallback(async () => {
    console.log("👾 Start AR");
    const { controller } = arContext;
    
    let postMatrixs = []; // Mover la declaración al inicio
  
    controller.onUpdate = (data) => {
      if (data.type === "updateMatrix") {
        const { targetIndex, worldMatrix } = data;
        setAnchors((anchors) => ({
          ...anchors,
          [targetIndex]:
            worldMatrix !== null
              ? new Matrix4()
                  .fromArray([...worldMatrix])
                  .multiply(postMatrixs[targetIndex])
                  .toArray()
              : invisibleMatrix.toArray(),
        }));
      }
    };
  
    resize();
  
    const { dimensions: imageTargetDimensions } = await controller.addImageTargets(imageTargets);
  
    for (let i = 0; i < imageTargetDimensions.length; i++) {
      const position = new Vector3();
      const quaternion = new Quaternion();
      const scale = new Vector3();
      const [markerWidth, markerHeight] = imageTargetDimensions[i];
      position.x = markerWidth / 2;
      position.y = markerWidth / 2 + (markerHeight - markerWidth) / 2;
      scale.x = markerWidth;
      scale.y = markerWidth;
      scale.z = markerWidth;
      const postMatrix = new Matrix4();
      postMatrix.compose(position, quaternion, scale);
      postMatrixs.push(postMatrix);
    }
  
    await controller.dummyRun(webcam.current.video);
    controller.processVideo(webcam.current.video);
  }, [arContext, imageTargets, resize, setAnchors, webcam]);
  
  const stopTracking = useCallback(() => {
    const { controller } = arContext;
    controller.stopProcessVideo();
  }, [arContext]);

  useEffect(() => {
    const loadedMetadataHandler = () => {
      console.log("📹 Ready");
      webcam.current.video.setAttribute("width", webcam.current.video.videoWidth);
      webcam.current.video.setAttribute("height", webcam.current.video.videoHeight);
      const { controller } = arContext;
      controller.inputWidth = webcam.current.video.videoWidth;
      controller.inputHeight = webcam.current.video.videoHeight;
      setReady(true);
    };

    const resizeHandler = () => {
      console.log("📐 Resize");
      resize();
    };

    webcam.current.video.addEventListener("loadedmetadata", loadedMetadataHandler);
    window.addEventListener("resize", resizeHandler);

    return () => {
      webcam.current.video.removeEventListener("loadedmetadata", loadedMetadataHandler);
      window.removeEventListener("resize", resizeHandler);
      stopTracking();
    };
  }, [startAR, resize, stopTracking, arContext]);

  useEffect(() => {
    if (ready) {
      startAR();
    }
  }, [ready, startAR]);

  const value = useMemo(() => ({ controller: arContext.controller }), [arContext]);
  return <ARContext.Provider value={value}>{children}</ARContext.Provider>;
});

export default AR;
