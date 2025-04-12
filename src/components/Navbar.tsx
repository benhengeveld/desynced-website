import { Link, Outlet } from "react-router";

const routes = [
	{ name: "Home", path: "/" },
	{ name: "Magic Prices", path: "magic-prices" },
	{ name: "About", path: "about" },
];

export default function Navbar() {
	return (
		<>
			<div className="h-navbar fixed inset-x-0 top-0 z-10 flex flex-row items-center bg-black/60 px-6 py-2 backdrop-blur">
				<Link
					to="/"
					className="flex h-full flex-row items-center rounded px-2 text-2xl font-bold hover:bg-white/10"
				>
					Sy_nc
				</Link>
				<nav className="flex h-full flex-row items-center">
					{routes.map(route => (
						<Link
							key={route.name}
							to={route.path}
							className="flex h-full min-w-16 flex-row items-center rounded px-2 font-medium hover:bg-white/10"
						>
							{route.name}
						</Link>
					))}
				</nav>
			</div>

			<div className="pt-navbar min-h-dvh">
				<Outlet />
			</div>
		</>
	);
}
