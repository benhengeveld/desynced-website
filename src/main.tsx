import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import Navbar from "@/components/Navbar";

import AboutPage from "@/pages/AboutPage";
import HomePage from "@/pages/HomePage";
import MagicPricesPage from "@/pages/MagicPricesPage";
import NotFound from "@/pages/NotFound";

import "@/styles/index.css";
import "@/styles/crt.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
	<BrowserRouter>
		<Routes>
			<Route element={<Navbar />}>
				<Route index element={<HomePage />} />
				<Route element={<MagicPricesPage />} path="magic-prices" />
				<Route element={<AboutPage />} path="about" />
				<Route element={<NotFound />} path="*" />
			</Route>
		</Routes>
	</BrowserRouter>
);
