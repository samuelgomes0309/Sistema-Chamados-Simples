import { CircleUser, Plus } from "lucide-react";
import SideBar from "../../components/sidebar";
import Title from "../../components/title";
import Input from "../../components/input";
import { useContext, useState, type ChangeEvent } from "react";
import { AuthContext } from "../../contexts/auth.context";
import avatar from "../../assets/avatar.png";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../services/firebase/api";

export default function Profile() {
	const { updateProfileUser, user, handleLogOut } = useContext(AuthContext)!;
	const [newAvatar, setNewAvatar] = useState<string | null>(
		user?.avatarUrl ?? null
	);
	const [imgFile, setImgfile] = useState<File | null>(null);
	const [name, setName] = useState(user?.name && user?.name);
	function handleAvatar(e: ChangeEvent<HTMLInputElement>) {
		const image = e.target.files;
		if (image !== null) {
			if (image[0].type === "image/jpeg" || image[0].type === "image/png") {
				const url = URL.createObjectURL(image[0]);
				setNewAvatar(url);
				setImgfile(image[0]);
			}
		} else {
			toast.error("Não foi possivel adicionar uma foto de perfil!");
			setNewAvatar(null);
		}
	}
	async function onSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		if (!name?.trim()) {
			toast.warning("O nome não pode estar vazio");
			return;
		}
		if (imgFile) {
			const imgRef = ref(storage, `images/${user?.uid}/${imgFile?.name}`);
			try {
				await uploadBytes(imgRef, imgFile);
				const url = await getDownloadURL(imgRef);
				updateProfileUser(url, name);
			} catch (error) {
				toast.error("Erro ao salvar a imagem, tente novamente");
			}
		}
	}
	return (
		<div className="flex min-h-screen flex-col bg-zinc-900 sm:flex-row">
			<SideBar />
			<div className="flex-grow bg-gray-300 p-5">
				<Title msg="Meu perfil">
					<CircleUser />
				</Title>
				<main className="mt-8 flex flex-col rounded-xl bg-white p-5">
					<form className="flex max-w-3xl flex-col items-start">
						<div className="flex w-full max-w-96 items-center justify-center">
							<label className="flex cursor-pointer items-center justify-center">
								<img
									alt="Foto de perfilF"
									className="h-40 w-40 rounded-full object-cover shadow-2xl shadow-zinc-400"
									src={newAvatar == null ? avatar : newAvatar}
								/>
								<input
									onChange={(e) => handleAvatar(e)}
									type="file"
									accept="image/*"
									multiple={false}
									className="hidden"
								/>
								<Plus
									className="absolute z-20 transition-all duration-500 hover:scale-105"
									size={45}
									color="#FFF"
								/>
							</label>
						</div>
						<label className="my-1.5 text-xl text-black">Nome:</label>
						<Input
							errors={false}
							placeholder="Nome do usuario"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="mt-3 mb-1.5 h-10 w-full max-w-96 rounded-sm border border-transparent bg-gray-100 px-3 transition-all duration-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
						/>
						<label className="my-1.5 text-xl text-black">Email:</label>
						<Input
							errors={false}
							placeholder="Email do usuario"
							disabled
							value={user?.email}
							className="mt-3 mb-1.5 h-10 w-full max-w-96 rounded-sm border border-transparent bg-gray-100 px-3 text-zinc-400 transition-all duration-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed"
						/>
						<button
							type="submit"
							onClick={(e) => onSubmit(e)}
							className="mt-3 mb-3 h-10 w-full max-w-96 cursor-pointer rounded-sm border-gray-400 bg-blue-950 py-1 text-xl font-bold text-white transition-all duration-500 hover:border-2 hover:bg-blue-800 sm:max-w-96"
						>
							Salvar
						</button>
					</form>
				</main>
				<footer className="mt-8 flex rounded-xl bg-white p-5">
					<button
						onClick={handleLogOut}
						className="flex h-12 w-20 cursor-pointer items-center justify-center rounded-sm border-2 border-red-900 font-bold transition-all duration-500 hover:bg-red-400 hover:text-white"
					>
						Sair
					</button>
				</footer>
			</div>
		</div>
	);
}
