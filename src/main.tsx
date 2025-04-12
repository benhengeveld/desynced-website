import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import Navbar from "@/components/Navbar";
import AboutPage from "@/pages/AboutPage";
import HomePage from "@/pages/HomePage";
import MagicPricesPage from "@/pages/MagicPricesPage";
import NotFound from "@/pages/NotFound";

import "@/index.css";
import "@/styles/crt.css";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<Routes>
			<Route element={<Navbar />}>
				<Route index element={<HomePage />} />
				<Route path="magic-prices" element={<MagicPricesPage />} />
				<Route path="about" element={<AboutPage />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	</BrowserRouter>,
);
