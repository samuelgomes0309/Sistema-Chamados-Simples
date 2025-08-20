import { Plus, TicketPlus } from "lucide-react";
import SideBar from "../../../../components/sidebar";
import Title from "../../../../components/title";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../contexts/app.context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newTicketSchema, type NewTicketData } from "./schema";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function NewTicket() {
	const nav = useNavigate();
	const [loading, setloading] = useState(true);
	const { customers, loadCustomer, createTicket } = useContext(AppContext)!;
	useEffect(() => {
		const getData = async () => {
			await loadCustomer();
			setloading(false);
		};
		getData();
	}, []);
	const subjectOptions = [
		{ id: 1, name: "Contabilidade", value: "Contabilidade" },
		{ id: 2, name: "Informatica", value: "Informatica" },
		{ id: 3, name: "Financeiro", value: "Financeiro" },
		{ id: 4, name: "Comercial", value: "Comercial" },
	];
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(newTicketSchema),
		defaultValues: {
			statusOption: "Aberto",
		},
	});
	async function onSubmit(data: NewTicketData) {
		if (!data) {
			toast.error("Verifique os campos");
			return;
		}
		const result = await createTicket(data);
		if (result) {
			nav("/dashboard");
			return;
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
				<Title msg={"Cadastrando chamado"}>
					<TicketPlus />
				</Title>
				<main className="mt-8 flex rounded-xl bg-white p-5">
					<form
						className="flex w-full flex-col"
						onSubmit={handleSubmit(onSubmit)}
					>
						<label className="mb-2 text-xl text-black">Cliente:</label>
						{customers.length === 0 && (
							<>
								<div className="mb-2 flex w-full max-w-2xs justify-center rounded-sm border border-transparent bg-gray-200 p-1 transition-all duration-500 outline-none select-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
									<span> Não possui um cliente cadastrado</span>
								</div>
								<div className="mb-2 w-full max-w-2xs rounded-sm border border-transparent bg-lime-500 p-1 transition-all duration-500 hover:bg-lime-700">
									<Link
										to={"/customers"}
										className="flex w-full cursor-pointer items-center justify-center gap-1 font-bold text-white"
									>
										Cadastre um cliente
										<Plus />
									</Link>
								</div>
							</>
						)}
						{customers.length > 0 && (
							<select
								{...register("customerId")}
								defaultValue={customers[0].id}
								className="mb-2 w-full max-w-2xs truncate rounded-sm border border-transparent bg-gray-200 p-1 transition-all duration-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							>
								{customers.map((customer) => (
									<option key={customer.id} value={customer.id}>
										{customer.name}
									</option>
								))}
							</select>
						)}
						{errors.customerId && (
							<p className="text-red-500">{errors.customerId.message}</p>
						)}
						<label className="mb-2 text-xl text-black">Assunto:</label>
						<select
							disabled={customers.length <= 0}
							{...register("subjectOption")}
							className="mb-2 w-full max-w-2xs rounded-sm border border-transparent bg-gray-200 p-1 transition-all duration-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed"
						>
							{subjectOptions.map((subject) => (
								<option key={subject.id} value={subject.value}>
									{subject.name}
								</option>
							))}
						</select>
						{errors.subjectOption && (
							<p className="text-red-500">{errors.subjectOption.message}</p>
						)}
						<label className="mb-2 text-xl text-black">Status:</label>
						<div className="mb-2 flex gap-4">
							<label className="flex cursor-pointer items-center gap-1">
								<input
									disabled={customers.length <= 0}
									{...register("statusOption")}
									type="radio"
									value="Aberto"
									className="h-4 w-4 accent-blue-600 hover:accent-blue-800 disabled:cursor-not-allowed"
								/>
								<span>Em aberto</span>
							</label>
							<label className="flex cursor-not-allowed items-center gap-1">
								<input
									type="radio"
									disabled={true}
									value="Finalizado"
									{...register("statusOption")}
									className="h-4 w-4 accent-blue-600 hover:accent-blue-800 disabled:cursor-not-allowed"
								/>
								<span>Atendido</span>
							</label>
							<label className="flex cursor-not-allowed items-center gap-1">
								<input
									type="radio"
									disabled={true}
									{...register("statusOption")}
									value="Em atendimento"
									className="h-4 w-4 accent-blue-600 hover:accent-blue-800 disabled:cursor-not-allowed"
								/>
								<span>Em progresso</span>
							</label>
						</div>
						{errors.statusOption && (
							<p className="text-red-500">{errors.statusOption.message}</p>
						)}
						<label>Complemento:</label>
						<textarea
							{...register("description")}
							disabled={customers.length <= 0}
							className="my-2 min-h-28 w-full resize-none rounded-sm border border-transparent bg-gray-200 px-3 py-2 transition-all duration-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed"
							placeholder="Dados adicionais/descrição do problema"
						/>
						<button
							type="submit"
							disabled={customers.length <= 0}
							className="mt-3 mb-3 h-10 w-full max-w-2xs cursor-pointer rounded-sm border-gray-400 bg-blue-950 py-1 text-xl font-bold text-white transition-all duration-500 hover:border-2 hover:bg-blue-800 disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500"
						>
							Salvar
						</button>
					</form>
				</main>
			</div>
		</div>
	);
}
