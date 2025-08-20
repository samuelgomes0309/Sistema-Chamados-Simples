import { Pen, Trash } from "lucide-react";
import SideBar from "../../components/sidebar";
import Title from "../../components/title";
import Input from "../../components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, type CustomerData } from "./schema";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/app.context";
import { toast } from "react-toastify";

export default function Customers() {
	const { createCustomer, customers, deleteCustomer, loadCustomer } =
		useContext(AppContext)!;
	const [loading, setloading] = useState(true);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CustomerData>({
		resolver: zodResolver(customerSchema),
	});
	useEffect(() => {
		const getData = async () => {
			await loadCustomer();
			setloading(false);
		};
		getData();
	}, []);
	function ErrorMessage({ message }: { message?: string }) {
		return (
			<p className="w-full max-w-96 font-semibold text-red-500 transition-all duration-500">
				{message}
			</p>
		);
	}
	async function handleDelete(id: string) {
		if (!id) return;
		await deleteCustomer(id);
	}
	async function onSubmit(data: CustomerData) {
		if (!data) return;
		const response = await createCustomer(data);
		if (response) {
			toast.success("Cliente cadastrado com sucesso!");
			reset();
		} else {
			toast.error("Erro ao cadastrar o cliente!");
		}
	}
	if (loading) {
		return (
			<div className="flex h-dvh w-dvw items-center justify-center bg-zinc-900">
				<div className="mx-auto my-auto flex flex-col items-center justify-center text-center">
					<div className="size-12 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-700" />
					<h2 className="mt-3.5 animate-pulse text-2xl font-semibold text-white">
						Carregando ...
					</h2>
				</div>
			</div>
		);
	}
	return (
		<div className="flex min-h-screen flex-col bg-zinc-900 sm:flex-row">
			<SideBar />
			<div className="flex-grow bg-gray-300 p-5">
				<Title msg="Novo Cliente">
					<Pen size={25} />
				</Title>
				<main className="mt-8 flex rounded-xl bg-white p-5">
					<form
						className="flex w-full max-w-4xl flex-col sm:max-w-96"
						onSubmit={handleSubmit(onSubmit)}
					>
						<label className="mb-2 text-xl font-semibold">Nome</label>
						<Input
							placeholder="Nome do cliente"
							maxLength={40}
							errors={errors.name?.message ? true : false}
							type="text"
							errorStyles="h-10 rounded-sm border border-transparent bg-gray-200 px-3 transition-all duration-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
							className="h-10 rounded-sm border border-transparent bg-gray-200 px-3 transition-all duration-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							{...register("name")}
						/>
						<ErrorMessage message={errors.name?.message} />
						<label className="mt-2 mb-2 text-xl font-semibold">Cnpj</label>
						<Input
							placeholder="CNPJ do cliente"
							errors={errors.cnpj?.message ? true : false}
							type="text"
							maxLength={14}
							errorStyles="h-10 rounded-sm border border-transparent bg-gray-200 px-3 transition-all duration-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
							className="h-10 rounded-sm border border-transparent bg-gray-200 px-3 transition-all duration-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							{...register("cnpj")}
						/>
						<ErrorMessage message={errors.cnpj?.message} />
						<label className="mt-2 mb-2 text-xl font-semibold">Endereço</label>
						<Input
							type="text"
							placeholder="Endereço do cliente"
							errors={errors.address?.message ? true : false}
							errorStyles="h-10 rounded-sm border border-transparent bg-gray-200 px-3 transition-all duration-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
							className="h-10 rounded-sm border border-transparent bg-gray-200 px-3 transition-all duration-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							{...register("address")}
						/>
						<ErrorMessage message={errors.address?.message} />
						<button
							type="submit"
							className="mt-3 mb-3 h-10 w-full max-w-4xl cursor-pointer rounded-sm border-gray-400 bg-blue-950 py-1 text-xl font-bold text-white transition-all duration-500 hover:border-2 hover:bg-blue-800 sm:max-w-96"
						>
							Cadastrar
						</button>
					</form>
				</main>
				{customers.length > 0 && (
					<section className="mt-8 flex flex-col rounded-xl bg-white p-5">
						<h2 className="mb-2.5 text-2xl"> Clientes já cadastrados:</h2>
						{customers.map((item) => (
							<div
								key={item?.id}
								className="my-1.5 flex items-center justify-between rounded-sm border border-gray-200 bg-gray-100 p-5 shadow"
							>
								<span className="flex-wrap wrap-anywhere">{`Nome: ${item?.name} Cnpj:${item?.cnpj}`}</span>
								<button
									onClick={() => handleDelete(item?.id)}
									className="cursor-pointer transition-all duration-500 hover:text-red-600"
								>
									<Trash size={30} />
								</button>
							</div>
						))}
					</section>
				)}
			</div>
		</div>
	);
}
