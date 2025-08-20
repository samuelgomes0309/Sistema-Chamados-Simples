import { X } from "lucide-react";
import React from "react";
import type { TicketProps } from "../../contexts/app.context";

interface ModalProps {
	modalvisible: (value: React.SetStateAction<boolean>) => void;
	ticket: TicketProps;
	setTicket: (value: React.SetStateAction<TicketProps | null>) => void;
}

export default function Modal({ modalvisible, ticket, setTicket }: ModalProps) {
	function handleBack() {
		setTicket(null);
		modalvisible(false);
	}
	return (
		<div
			className="fixed inset-0 z-20 flex h-full w-full bg-black/50"
			onClick={handleBack}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative z-50 mx-auto my-auto flex w-full max-w-2xl min-w-80 flex-col gap-2 rounded-lg bg-white p-5"
			>
				<button
					onClick={handleBack}
					className="flex w-28 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-600 p-1 text-white"
				>
					<X />
					Voltar
				</button>
				<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
					<label className="font-semibold">Cliente:</label>
					<span>{ticket?.customerData?.name}</span>
				</div>
				<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
					<label className="font-semibold">Assunto:</label>
					<span>{ticket?.subjectOption}</span>
					<label className="font-semibold">Cadastrado em:</label>
					<span>{ticket?.createdAt.toDate().toLocaleDateString("pt-br")}</span>
				</div>
				<div className="flex items-center">
					<label className="font-semibold">Status:</label>
					<span
						className={`${
							ticket?.statusOption === "Aberto" ? "bg-lime-400" : "bg-blue-600"
						} ml-2 flex items-center justify-center rounded-xl px-2 py-1 font-bold`}
					>
						{ticket?.statusOption}
					</span>
				</div>
				<span className="font-semibold">Complemento:</span>
				<p>
					{ticket.description.length != 0
						? ticket.description
						: "Chamado não possui dados adicionais..."}
				</p>
			</div>
		</div>
	);
}
