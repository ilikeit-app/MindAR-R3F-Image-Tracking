// /components/Experience.jsx
import { useEffect, useMemo } from "react";
//import { useAtomValue } from "jotai";
//import { anchorStatusAtom } from "../AR/ARContext";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import models from "../../data/models";
import { Base } from "./Base";
import { Coffee } from "./Coffee";
import { Croissant } from "./Croissant";
import { Donut } from "./Donut";

export const Experience = ({ selectedModel }) => {
	const { gl, camera, scene } = useThree();

	/*useEffect(() => {
		models.forEach((model) => {
			useLoader.preload(GLTFLoader, model.modelURL);
		});
	}, []);

	const gltf = useMemo(
		() => useLoader(GLTFLoader, selectedModel.modelURL),
		[selectedModel]
	);*/
	console.log(selectedModel);

	const modelsIndex = {
		0: <Coffee scale={[5, 5, 5]} />,
		1: <Croissant scale={[5, 5, 5]} />,
		2: <Donut scale={[5, 5, 5]} />,
	};

	return (
		<>
			<Base scale={[5, 5, 5]} />
			{modelsIndex[selectedModel]}
		</>
	);
};
