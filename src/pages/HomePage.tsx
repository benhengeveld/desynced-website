export default function HomePage() {
	return (
		<div className="fixed inset-0 bg-black">
			<div className="crt pointer-events-none absolute inset-0 z-10" />
			<img
				alt="Background"
				className="absolute inset-0 h-full w-full blur"
				src="https://i.imgur.com/1Y1gIXy.jpg"
			/>
			<h1 className="absolute inset-1/2 h-max w-max -translate-1/2 rounded-md bg-black/60 p-2 pb-6 text-9xl font-bold backdrop-blur">
				Sy_nc
			</h1>
		</div>
	);
}
