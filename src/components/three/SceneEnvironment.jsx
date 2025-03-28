// /components/SceneEnvironment.jsx
import { Environment } from "@react-three/drei";

export const SceneEnvironment = () => {
	return (
		<>
			<ambientLight />
			<Environment
				preset="city"
				environmentRotation={[0, Math.PI * 0.5, 0]}
			/>
		</>
	);
};
