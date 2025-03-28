// src/components/Carousel.jsx
import { useState, useRef, useEffect } from "react";
import models from "../../data/models";

const Carousel = ({ onSelectModel }) => {
	const containerRef = useRef(null);

	// Configuración de tamaños (en píxeles)
	const IMAGE_SIZE = 64; // Tamaño del cuadrado para la imagen
	const SLIDE_WIDTH = IMAGE_SIZE; // Ancho total ocupado por cada slide (sin GAP)

	// currentIndex representa el slide "snappeado" actualmente.
	const [currentIndex, setCurrentIndex] = useState(0);
	// dragOffset en píxeles, acumulado durante el arrastre.
	const [dragOffset, setDragOffset] = useState(0);
	const isDraggingRef = useRef(false);
	const startXRef = useRef(0);
	const [containerWidth, setContainerWidth] = useState(0);

	// Actualizamos el modelo seleccionado cada vez que currentIndex cambia.
	useEffect(() => {
		onSelectModel(models[currentIndex]);
	}, [currentIndex, onSelectModel]);

	// Al montar, guardamos el ancho del contenedor.
	useEffect(() => {
		if (containerRef.current) {
			setContainerWidth(containerRef.current.offsetWidth);
		}
	}, []);

	const handlePointerDown = (e) => {
		isDraggingRef.current = true;
		startXRef.current = e.clientX;
	};

	const handlePointerMove = (e) => {
		if (!isDraggingRef.current) return;
		const delta = e.clientX - startXRef.current;
		// Limitar el movimiento si estamos en el primer o último slide.
		if (currentIndex === 0 && delta > 0) {
			setDragOffset(0);
			return;
		}
		if (currentIndex === models.length - 1 && delta < 0) {
			setDragOffset(0);
			return;
		}
		setDragOffset(delta);
	};

	const handlePointerUp = () => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;
		const threshold = SLIDE_WIDTH / 2; // Umbral para cambiar de slide.
		let newIndex = currentIndex;
		if (dragOffset < -threshold && currentIndex < models.length - 1) {
			newIndex = currentIndex + 1;
		} else if (dragOffset > threshold && currentIndex > 0) {
			newIndex = currentIndex - 1;
		}
		setCurrentIndex(newIndex);
		setDragOffset(0);
	};

	// Calculamos el offset base para centrar el slide seleccionado:
	// El centro del contenedor es containerWidth / 2.
	// El centro del slide seleccionado está en: currentIndex * SLIDE_WIDTH + IMAGE_SIZE / 2.
	const baseOffset =
		containerWidth / 2 - (currentIndex * SLIDE_WIDTH + IMAGE_SIZE / 2);
	// Se suma el dragOffset acumulado.
	const totalOffsetPx = baseOffset + dragOffset;

	return (
		<div
			ref={containerRef}
			className="w-full max-w-xs mx-auto relative select-none touch-pan-x"
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerUp}
		>
			{/* Overlay central: cuadrado redondeado que marca la zona de selección */}
			<div className="absolute inset-0 pointer-events-none flex items-center justify-center">
				<div className="w-16 h-16 border-2 border-white rounded-lg"></div>
			</div>

			{/* Contenedor de slides */}
			<div
				className="flex transition-transform duration-300"
				style={{ transform: `translate(${totalOffsetPx}px, 16px)` }}
			>
				{models.map((model, index) => {
					// El centro del slide: index * SLIDE_WIDTH + IMAGE_SIZE / 2.
					const slideCenter = index * SLIDE_WIDTH + IMAGE_SIZE / 2;
					// Distancia absoluta entre el centro efectivo del slide y el centro del contenedor.
					const distance = Math.abs(
						slideCenter + totalOffsetPx - containerWidth / 2
					);
					// Normalizamos la distancia: 0 cuando centrado y 1 cuando la diferencia es igual o mayor a la mitad del slide.
					const normalizedDistance = Math.min(
						distance / (SLIDE_WIDTH / 2),
						1
					);
					// Opacidad: 1 (centrado) a 0.5 (alejado).
					const opacity = 1 - normalizedDistance * 0.5;
					// Escala: 1 (centrado) a 0.8 (alejado).
					const scale = 1 - normalizedDistance * 0.2;

					return (
						<div
							key={model.id}
							className="flex flex-col items-center transition-all duration-300 cursor-pointer"
							style={{
								width: `${SLIDE_WIDTH}px`,
								opacity,
								transform: `scale(${scale})`,
							}}
							onClick={() => {
								// Si el drag fue mínimo, interpretamos el click para centrar el slide.
								if (Math.abs(dragOffset) < 5) {
									setCurrentIndex(index);
									setDragOffset(0);
								}
							}}
						>
							{/* Contenedor para la imagen, de tamaño fijo (64x64) con bordes redondeados */}
							<div className="w-16 h-16 flex items-center justify-center rounded-lg overflow-hidden">
								<img
									src={model.imageURL}
									alt={model.name}
									className="max-w-full max-h-full rounded-lg object-contain"
								/>
							</div>
							{/* El nombre se muestra debajo del cuadrado */}
							<p className="mt-2 text-center text-white">
								{model.name}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Carousel;
