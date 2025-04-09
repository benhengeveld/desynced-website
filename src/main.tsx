import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./routes/Home.tsx";
import NotFound from "./routes/NotFound.tsx";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>,
);
