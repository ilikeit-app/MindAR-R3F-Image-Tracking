import { useRef, useState, useEffect } from "react";
import { ARCanvas, ARAnchor } from "./components/AR";
import { Experience } from "./components/three/Experience";
import Carousel from "./components/overlay/Carousel";
import SplashScreen from "./components/overlay/SplashScreen";
import logo from "./assets/images/Logo-iLikeit-fondo-transparente-6.png";
import { SceneEnvironment } from "./components/three/SceneEnvironment";

function App() {
	const container = useRef();
	const [animateSplash, setAnimateSplash] = useState(false);
	const [selectedModel, setSelectedModel] = useState(0);
	const [showSplash, setShowSplash] = useState(true);

	const handleSelectModel = (model) => {
		setSelectedModel(model);
	};

	const handleStartAR = () => {
		setAnimateSplash(true);
		setTimeout(() => {
			setShowSplash(false);
		}, 1000);
	};

	/*const anchorStatus = useAtomValue(anchorStatusAtom);

	useEffect(() => {
		console.log("Anchor status:", anchorStatus);
	}, [anchorStatus]);
	*/

	return (
		<div
			id="app-wrapper"
			className="relative w-full h-[100dvh] overflow-hidden"
		>
			{showSplash && <SplashScreen logo={logo} animate={animateSplash} />}
			<header className="flex justify-start items-center bg-violet-700 text-white text-center p-1 w-full max-h-[15vh]">
				<img
					className="w-20 max-w-full"
					src={logo}
					alt="ilikeit-logo"
				/>
			</header>
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
					imageTargets="/assets/target/my-target.mind"
					filterMinCF={0.001}
					filterBeta={2000}
					warmupTolerance={2}
					missTolerance={2}
					handleStartAR={handleStartAR}
				>
					<SceneEnvironment />
					<ARAnchor dampingMultiplier={30}>
						<Experience selectedModel={selectedModel.id} />
					</ARAnchor>
				</ARCanvas>
			</div>

			<footer className="absolute bottom-[2%] left-0 right-0 p-2 flex items-center justify-center">
				<Carousel onSelectModel={handleSelectModel} />
			</footer>
		</div>
	);
}

export default App;
