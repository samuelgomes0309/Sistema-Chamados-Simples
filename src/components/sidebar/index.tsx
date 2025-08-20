import { Link, useLocation } from "react-router-dom";
import backgroundImage from "../../assets/cover.png";
import defaultAvatar from "../../assets/avatar.png";
import { House, UserPlus, Cog } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";

export default function SideBar() {
	const { user } = useContext(AuthContext)!;
	const location = useLocation();
	const defaultStyled =
		"my-1.5 flex h-11 items-center gap-2 bg-zinc-800 p-4 font-bold transition-all duration-500 hover:bg-blue-400 hover:text-white";
	const activeStyled =
		"my-1.5 flex h-11 items-center gap-2 bg-zinc-500 p-4 font-bold text-white transition-all duration-500 hover:bg-blue-400";
	function getLinkClass(path: string) {
		return location.pathname === path ? activeStyled : defaultStyled;
	}
	return (
		<aside className="max-h-60 w-full bg-zinc-900 text-gray-500 sm:min-h-screen sm:max-w-1/5 sm:flex-col">
			<aside className="mb-3 hidden sm:block">
				<div className="relative flex h-48 w-full items-center justify-center">
					<img
						className="h-full w-full object-cover"
						src={backgroundImage}
						alt="Imagem de fundo"
					/>
					<img
						src={user?.avatarUrl !== null ? user?.avatarUrl : defaultAvatar}
						alt="Imagem do avatar"
						className="absolute z-50 h-32 w-32 rounded-full border object-cover shadow-2xl shadow-black"
					/>
				</div>
			</aside>
			<nav>
				<Link to={"/dashboard"} className={getLinkClass("/dashboard")}>
					<House size={25} />
					Home
				</Link>
				<Link to={"/customers"} className={getLinkClass("/customers")}>
					<UserPlus />
					Clientes
				</Link>
				<Link to={"/profile"} className={getLinkClass("/profile")}>
					<Cog />
					Perfil
				</Link>
			</nav>
		</aside>
	);
}
