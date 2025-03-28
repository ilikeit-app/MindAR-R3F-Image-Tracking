/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 src/assets/models/donut.glb --transform 
Files: src/assets/models/donut.glb [9.93MB] > /Users/federicomartin/Desktop/Programación/ilikeit/mindar-r3f-image-tracking/donut-transformed.glb [363.91KB] (96%)
*/

import React from "react";
import { useGLTF } from "@react-three/drei";
import donutModelURL from "../../assets/models/donut-transformed.glb";

export function Donut(props) {
	const { nodes, materials } = useGLTF(donutModelURL);
	return (
		<group {...props} dispose={null}>
			<mesh
				geometry={nodes.Donut001.geometry}
				material={materials["Material_0.002"]}
			/>
		</group>
	);
}

useGLTF.preload(donutModelURL);
