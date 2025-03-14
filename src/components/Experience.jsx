// /components/Experience.jsx
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { anchorStatusAtom } from "./AR/ARContext"; // Ajusta la ruta según tu estructura

export const Experience = () => {
  const anchorStatus = useAtomValue(anchorStatusAtom);

  useEffect(() => {
    console.log("Anchor status:", anchorStatus);
  }, [anchorStatus]);

  return (
    <>
      {/* <OrbitControls /> */}
      <mesh>
        <planeGeometry args={[1, 0.55]} />
        <meshBasicMaterial transparent color={0x0000ff} opacity={0.5} />
      </mesh>
    </>
  );
};
