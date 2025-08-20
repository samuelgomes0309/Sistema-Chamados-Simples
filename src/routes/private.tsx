import { useContext, type ReactNode } from "react";
import { AuthContext } from "../contexts/auth.context";
import { Navigate } from "react-router-dom";
import RouteLoader from "./components/loader";

interface PrivateProps {
	children: ReactNode;
}

export default function Private({ children }: PrivateProps) {
	const { signed, loadingAuth } = useContext(AuthContext)!;
	if (loadingAuth) {
		return <RouteLoader />;
	}
	if (!signed) {
		return <Navigate to="/" replace />;
	}
	return children;
}
