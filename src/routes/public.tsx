import { useContext, type ReactNode } from "react";
import { AuthContext } from "../contexts/auth.context";
import { Navigate } from "react-router-dom";
import RouteLoader from "./components/loader";

interface PublicProps {
	children: ReactNode;
}

export default function Public({ children }: PublicProps) {
	const { signed, loadingAuth } = useContext(AuthContext)!;
	if (loadingAuth) {
		return <RouteLoader />;
	}
	if (signed) {
		return <Navigate to="/dashboard" replace />;
	}
	return children;
}
