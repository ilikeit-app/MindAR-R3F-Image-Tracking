import { OrbitControls } from "@react-three/drei";

export const Experience = () => {
  return (
    <>
      {/* <OrbitControls /> */}
      <mesh>
      <planeGeometry args={[1, 0.55]} />
      <meshBasicMaterial transparent color={0x0000ff} opacity={0.5} />
    </mesh>
      {/* <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh> */}
    </>
  );
};