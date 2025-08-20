import { createBrowserRouter, type RouteObject } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Customers from "./pages/customers";
import Private from "./routes/private";
import Public from "./routes/public";
import NewTicket from "./pages/home/tickets/new";
import EditingTicket from "./pages/home/tickets/editing";

const routes: RouteObject[] = [
	{
		path: "/",
		element: (
			<Public>
				<Login />
			</Public>
		),
	},
	{
		path: "/dashboard",
		element: (
			<Private>
				<Home />
			</Private>
		),
	},
	{
		path: "/dashboard/new-ticket",
		element: (
			<Private>
				<NewTicket />
			</Private>
		),
	},
	{
		path: "/dashboard/ticket/:ticketId",
		element: (
			<Private>
				<EditingTicket />
			</Private>
		),
	},
	{
		path: "/profile",
		element: (
			<Private>
				<Profile />
			</Private>
		),
	},
	{
		path: "/customers",
		element: (
			<Private>
				<Customers />
			</Private>
		),
	},
];

const router = createBrowserRouter(routes);
export default router;
