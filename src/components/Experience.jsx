// /components/Experience.jsx
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { anchorStatusAtom } from "./AR/ARContext"; // Ajusta la ruta según tu estructura
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export const Experience = () => {
  const anchorStatus = useAtomValue(anchorStatusAtom);
  const texture = useLoader(TextureLoader, '/assets/velada.webp');
  const texture2 = useLoader (TextureLoader, '/assets/velada-web.jpg')
  const scale=2

  useEffect(() => {
    console.log("Anchor status:", anchorStatus);
  }, [anchorStatus]);

  return (
    <>
      <mesh>
        {/* <planeGeometry args={[1, 0.55]} /> */}
        <planeGeometry args={[1,0.838]}/>
        {/* <meshBasicMaterial transparent color={0x0000ff} opacity={0.5} /> */}
        <meshBasicMaterial transparent map={texture} />
      </mesh>
      <mesh position={[0, -0.3, -0.01]} scale={[3.2,3.2,0]}>
        <planeGeometry args={[1, 0.828125]}/>
        <meshBasicMaterial transparent opacity={0.2} map={texture2} />
      </mesh>
    </>
  );
};
