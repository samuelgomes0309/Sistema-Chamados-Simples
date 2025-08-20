import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./App";
import { AuthContextProvider } from "./contexts/auth.context";
import { ToastContainer } from "react-toastify";
import { AppContextProvider } from "./contexts/app.context";

createRoot(document.getElementById("root")!).render(
	<AuthContextProvider>
		<AppContextProvider>
			<RouterProvider router={router} />
			<ToastContainer autoClose={3000} />
		</AppContextProvider>
	</AuthContextProvider>
);
