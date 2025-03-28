// src/components/SplashScreen.jsx
const SplashScreen = ({ logo, animate }) => {
	return (
		<div
			className={`fixed inset-0 z-50 flex flex-col gap-1 items-center justify-center bg-violet-700 transition-transform duration-1000 ${
				animate ? "animate-slideUpSimple" : ""
			}`}
		>
			<img src={logo} alt="ilikeit-logo" className="w-64" />
			<span className="pr-2 text-white font-normal text-lg">Food</span>
		</div>
	);
};

export default SplashScreen;
