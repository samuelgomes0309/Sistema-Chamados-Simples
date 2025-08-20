import { MessageCircle, Pencil, Plus, RefreshCcw, Search } from "lucide-react";
import SideBar from "../../components/sidebar";
import Title from "../../components/title";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext, type TicketProps } from "../../contexts/app.context";
import { toast } from "react-toastify";
import Modal from "../../components/modal";

export default function Home() {
	const { tickets, loadingApp, loadMoreTickets, loadMoreBtn, getTickets } =
		useContext(AppContext)!;
	const [modalVisible, setModalVisible] = useState(false);
	const [ticketInfo, setTicketInfo] = useState<TicketProps | null>(null);
	const thStyle = "flex w-full items-center justify-center border p-2";
	const tdStyle =
		"flex w-full justify-center border p-2 text-left lg:justify-start";
	async function handleMoreTickets() {
		const response = await loadMoreTickets();
		if (response === "sem-chamados") {
			toast.warn("Todos os chamados já se encontram na tabela.");
			return;
		}
	}
	async function handleModalVisible(ticket: any) {
		if (!ticket) return;
		setTicketInfo(ticket);
		setModalVisible(true);
	}
	if (loadingApp) {
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
				<Title msg="Chamados">
					<MessageCircle />
				</Title>
				{tickets.length !== 0 && (
					<>
						<div className="my-5 flex h-12 w-full justify-center sm:justify-end">
							<button
								onClick={async () => {
									await getTickets();
									toast.success("Chamados atualizados com sucesso!");
								}}
								className="mr-3.5 flex cursor-pointer items-center justify-center gap-1.5 rounded-sm border-indigo-900 bg-indigo-500 p-5 font-bold text-white transition-all duration-500 hover:border-2 hover:bg-indigo-600"
							>
								Atualizar todos
								<RefreshCcw />
							</button>
							<Link
								to={"/dashboard/new-ticket"}
								className="flex cursor-pointer items-center justify-center gap-1.5 rounded-sm border-lime-900 bg-lime-500 p-5 font-bold text-white transition-all duration-500 hover:border-2 hover:bg-lime-600"
							>
								<Plus />
								<span>Novo chamado</span>
							</Link>
						</div>
					</>
				)}
				<main
					className={
						tickets.length > 0
							? "mt-8 flex flex-col bg-transparent"
							: "mt-8 flex flex-col rounded-xl bg-white p-5"
					}
				>
					{tickets.length === 0 && (
						<div className="mx-auto my-5 flex h-52 flex-col items-center justify-center">
							<h1 className="mb-2.5 text-xl font-bold">
								Nenhum chamado registrado...
							</h1>
							<Link
								to={"/dashboard/new-ticket"}
								className="flex max-h-7 w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm border-lime-900 bg-lime-500 p-5 font-bold text-white transition-all duration-500 hover:border-2 hover:bg-lime-600"
							>
								<Plus />
								<span>Novo chamado</span>
							</Link>
						</div>
					)}
					{tickets.length !== 0 && (
						<table className="flex table-auto flex-col bg-white">
							<thead>
								<tr className="flex w-full flex-col lg:flex-row">
									<th className={thStyle}>Cod. Chamado</th>
									<th className={thStyle}>Cliente</th>
									<th className={thStyle}>Assunto</th>
									<th className={thStyle}>Status</th>
									<th className={thStyle}>Criado em</th>
									<th className={thStyle}></th>
								</tr>
							</thead>
							<tbody>
								{tickets.map((ticket, index) => (
									<tr
										key={ticket.id}
										className="mt-5 flex flex-col lg:mt-0 lg:flex-row"
									>
										<td className={tdStyle}>{index + 1}</td>
										<td className={tdStyle}>{ticket.customerData?.name}</td>
										<td className={tdStyle}>{ticket.subjectOption}</td>
										<td
											className={`${ticket?.statusOption === "Aberto" ? "border-black bg-lime-400 text-white" : "border-black bg-blue-600 text-white"} flex w-full justify-center border p-2 text-left font-semibold lg:justify-start`}
										>
											{ticket.statusOption}
										</td>
										<td className={tdStyle}>
											{ticket.createdAt.toDate().toLocaleDateString("pt-br")}
										</td>
										<td className="sm: mb-5 flex w-full items-center justify-center gap-1.5 border p-2 sm:mb-0">
											<button
												onClick={() => handleModalVisible(ticket)}
												className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-blue-400 transition-all duration-500 hover:bg-blue-700"
											>
												<Search color="#FFFF" size={20} />
											</button>
											<Link
												to={`/dashboard/ticket/${ticket.id}`}
												className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-yellow-400 transition-all duration-500 hover:bg-yellow-600"
											>
												<Pencil color="#FFFF" size={20} />
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</main>
				{loadMoreBtn && tickets.length > 0 && (
					<div className="my-5 flex h-12 w-full justify-center">
						<button
							type="button"
							onClick={handleMoreTickets}
							className="flex cursor-pointer items-center justify-center gap-1.5 rounded-sm border-blue-900 bg-blue-500 p-5 font-bold text-white transition-all duration-500 hover:border-2 hover:bg-blue-600"
						>
							<Plus />
							<span>Buscar chamados</span>
						</button>
					</div>
				)}
			</div>
			{ticketInfo !== null && modalVisible && (
				<Modal
					ticket={ticketInfo}
					setTicket={() => setTicketInfo(null)}
					modalvisible={() => setModalVisible(false)}
				/>
			)}
		</div>
	);
}
