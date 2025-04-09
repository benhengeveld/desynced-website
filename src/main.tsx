import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "@/routes/Home.tsx";
import NotFound from "@/routes/NotFound.tsx";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>,
);
