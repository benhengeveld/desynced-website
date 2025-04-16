import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
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

const queryClient = new QueryClient();

createRoot(root).render(
	<HelmetProvider>
		<Helmet>
			<title>Sy_nc</title>
		</Helmet>

		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route element={<Navbar />}>
						<Route index element={<HomePage />} />
						<Route
							element={<MagicPricesPage />}
							path="magic-prices"
						/>
						<Route element={<AboutPage />} path="about" />
						<Route element={<NotFound />} path="*" />
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	</HelmetProvider>
);
