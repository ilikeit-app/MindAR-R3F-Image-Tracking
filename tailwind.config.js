/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				slideUpSimple: {
					"0%": { transform: "translateY(0)", opacity: 1 },
					"20%": { transform: "translateY(1.5%)", opacity: 1 }, // Movimiento inicial hacia abajo
					"100%": { transform: "translateY(-100%)", opacity: 0 }, // Sale completamente hacia arriba
				},
			},
			animation: {
				slideUpSimple: "slideUpSimple 0.5s ease-in-out forwards",
			},
		},
	},
	plugins: [],
};
