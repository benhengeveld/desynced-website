<script lang="ts">
	import { onMount } from 'svelte';

	const { text, font }: { text: string; font: string } = $props();

	const MOUSE_RADIUS = 80;
	const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
	const PUSH_STRENGTH = 6;
	const PUSH_STRENGTH_RANDOMNESS = 0.5;
	const PIXEL_FRICTION = 0.78;
	const PIXEL_SPRING_BACK_STRENGTH = 0.1;
	const PIXEL_SIZE = 1;
	const PIXEL_GAP = 0;
	const PIXEL_RED_OFFSET = 0.1;
	const PIXEL_GREEN_OFFSET = 0.3;
	const PIXEL_BLUE_OFFSET = 0.5;
	const PIXEL_USE_ALPHA = true;

	let canvas = $state<HTMLCanvasElement>();
	let ctx: CanvasRenderingContext2D;
	let animationFrameId: number | null = null;
	let frameBuffer: ImageData | null = null;
	let particles: Particle[] = [];
	let mouse: { x: number; y: number } | null = null;

	class Particle {
		x: number;
		y: number;
		baseX: number;
		baseY: number;
		velocityX: number;
		velocityY: number;
		size: number;
		alpha: number;
		displaced: boolean;
		normalizedX: number;
		normalizedY: number;
		redOffset: number;
		greenOffset: number;
		blueOffset: number;
		pushRandomness: number;

		constructor(x: number, y: number, alpha: number) {
			this.x = x;
			this.y = y;
			this.baseX = x;
			this.baseY = y;
			this.velocityX = 0;
			this.velocityY = 0;
			this.size = PIXEL_SIZE;
			this.alpha = alpha;
			this.displaced = false;
			this.normalizedX = 0;
			this.normalizedY = 0;
			this.redOffset = 0;
			this.greenOffset = 0;
			this.blueOffset = 0;
			this.pushRandomness =
				Math.random() * PUSH_STRENGTH_RANDOMNESS + (1 - PUSH_STRENGTH_RANDOMNESS / 2);
		}

		update() {
			if (mouse !== null) {
				const distanceX = this.x - mouse.x;
				const distanceY = this.y - mouse.y;
				const distanceSquared = distanceX * distanceX + distanceY * distanceY;

				if (distanceSquared < MOUSE_RADIUS_SQ && distanceSquared !== 0) {
					const dist = Math.sqrt(distanceSquared);
					const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
					const invDist = 1 / dist;
					this.velocityX += distanceX * invDist * force * PUSH_STRENGTH * this.pushRandomness;
					this.velocityY += distanceY * invDist * force * PUSH_STRENGTH * this.pushRandomness;
				}
			}

			this.velocityX += (this.baseX - this.x) * PIXEL_SPRING_BACK_STRENGTH;
			this.velocityY += (this.baseY - this.y) * PIXEL_SPRING_BACK_STRENGTH;
			this.velocityX *= PIXEL_FRICTION;
			this.velocityY *= PIXEL_FRICTION;
			this.x += this.velocityX;
			this.y += this.velocityY;

			const deltaBaseX = this.x - this.baseX;
			const deltaBaseY = this.y - this.baseY;
			const deltaBaseSquared = deltaBaseX * deltaBaseX + deltaBaseY * deltaBaseY;

			if (deltaBaseSquared <= 0.25) {
				this.displaced = false;
			} else {
				const distance = Math.sqrt(deltaBaseSquared);
				this.displaced = true;
				this.normalizedX = deltaBaseX / distance;
				this.normalizedY = deltaBaseY / distance;
				this.redOffset = distance * PIXEL_RED_OFFSET;
				this.greenOffset = distance * PIXEL_GREEN_OFFSET;
				this.blueOffset = distance * PIXEL_BLUE_OFFSET;
			}
		}
	}

	function resizeCanvas() {
		const rect = canvas!.getBoundingClientRect();
		canvas!.width = rect.width;
		canvas!.height = rect.height;
		frameBuffer = ctx.createImageData(canvas!.width, canvas!.height);
		createTextParticles(text);
	}

	function createTextParticles(t: string) {
		particles = [];
		ctx.clearRect(0, 0, canvas!.width, canvas!.height);
		ctx.fillStyle = 'white';
		ctx.font = font;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(t, canvas!.width / 2, canvas!.height / 2);

		const imageData = ctx.getImageData(0, 0, canvas!.width, canvas!.height);
		const data = imageData.data;

		for (let y = 0; y < canvas!.height; y += PIXEL_GAP + PIXEL_SIZE) {
			for (let x = 0; x < canvas!.width; x += PIXEL_GAP + PIXEL_SIZE) {
				const index = (y * canvas!.width + x) * 4;
				const alpha = data[index + 3];
				if (alpha >= 1) {
					particles.push(new Particle(x, y, PIXEL_USE_ALPHA ? alpha : 255));
				}
			}
		}
	}

	function startAnimation() {
		if (animationFrameId === null) {
			animate();
		}
	}

	function animate() {
		const width = canvas!.width;
		const height = canvas!.height;
		const data = frameBuffer!.data;
		data.fill(0);

		for (let i = 0; i < particles.length; i++) {
			const particle = particles[i];
			particle.update();

			if (!particle.displaced) {
				const baseX = Math.round(particle.x);
				const baseY = Math.round(particle.y);
				for (let offsetY = 0; offsetY < PIXEL_SIZE; offsetY++) {
					for (let offsetX = 0; offsetX < PIXEL_SIZE; offsetX++) {
						const pixelX = baseX + offsetX;
						const pixelY = baseY + offsetY;
						if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
							const index = (pixelY * width + pixelX) * 4;
							data[index] = 255;
							data[index + 1] = 255;
							data[index + 2] = 255;
							data[index + 3] = particle.alpha;
						}
					}
				}
			} else {
				const alpha = particle.alpha;
				const normalizedX = particle.normalizedX;
				const normalizedY = particle.normalizedY;

				const redBaseX = Math.round(particle.x + normalizedX * particle.redOffset);
				const redBaseY = Math.round(particle.y + normalizedY * particle.redOffset);
				for (let offsetY = 0; offsetY < PIXEL_SIZE; offsetY++) {
					for (let offsetX = 0; offsetX < PIXEL_SIZE; offsetX++) {
						const redX = redBaseX + offsetX;
						const redY = redBaseY + offsetY;
						if (redX >= 0 && redX < width && redY >= 0 && redY < height) {
							const index = (redY * width + redX) * 4;
							data[index] = Math.min(255, data[index] + alpha);
							data[index + 3] = 255;
						}
					}
				}

				const greenBaseX = Math.round(particle.x + normalizedX * particle.greenOffset);
				const greenBaseY = Math.round(particle.y + normalizedY * particle.greenOffset);
				for (let offsetY = 0; offsetY < PIXEL_SIZE; offsetY++) {
					for (let offsetX = 0; offsetX < PIXEL_SIZE; offsetX++) {
						const greenX = greenBaseX + offsetX;
						const greenY = greenBaseY + offsetY;
						if (greenX >= 0 && greenX < width && greenY >= 0 && greenY < height) {
							const index = (greenY * width + greenX) * 4;
							data[index + 1] = Math.min(255, data[index + 1] + alpha);
							data[index + 3] = 255;
						}
					}
				}

				const blueBaseX = Math.round(particle.x + normalizedX * particle.blueOffset);
				const blueBaseY = Math.round(particle.y + normalizedY * particle.blueOffset);
				for (let offsetY = 0; offsetY < PIXEL_SIZE; offsetY++) {
					for (let offsetX = 0; offsetX < PIXEL_SIZE; offsetX++) {
						const blueX = blueBaseX + offsetX;
						const blueY = blueBaseY + offsetY;
						if (blueX >= 0 && blueX < width && blueY >= 0 && blueY < height) {
							const index = (blueY * width + blueX) * 4;
							data[index + 2] = Math.min(255, data[index + 2] + alpha);
							data[index + 3] = 255;
						}
					}
				}
			}
		}

		ctx.putImageData(frameBuffer!, 0, 0);
		animationFrameId = requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas!.getContext('2d')!;

		const onMouseMove = (e: MouseEvent) => {
			const rect = canvas!.getBoundingClientRect();
			mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		};
		const onMouseLeave = () => {
			mouse = null;
		};
		const onVisibilityChange = () => {
			if (document.hidden) {
				cancelAnimationFrame(animationFrameId!);
				animationFrameId = null;
			} else {
				startAnimation();
			}
		};

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseleave', onMouseLeave);
		window.addEventListener('resize', resizeCanvas);
		document.addEventListener('visibilitychange', onVisibilityChange);

		resizeCanvas();
		startAnimation();

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseleave', onMouseLeave);
			window.removeEventListener('resize', resizeCanvas);
			document.removeEventListener('visibilitychange', onVisibilityChange);
			cancelAnimationFrame(animationFrameId!);
		};
	});
</script>

<canvas bind:this={canvas} class="pointer-events-none absolute inset-0 h-full w-full"></canvas>
