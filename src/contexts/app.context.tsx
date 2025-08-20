import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import type { CustomerData } from "../pages/customers/schema";
import { AuthContext } from "./auth.context";
import { toast } from "react-toastify";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	startAfter,
	Timestamp,
	updateDoc,
	where,
	type DocumentData,
} from "firebase/firestore";
import { db } from "../services/firebase/api";
import type { NewTicketData } from "../pages/home/tickets/new/schema";

export const AppContext = createContext<AppContextValues | null>(null);

interface CustomerProps extends CustomerData {
	id: string;
}

interface AppContextValues {
	createCustomer: (data: CustomerData) => Promise<boolean>;
	loadCustomer: () => Promise<void>;
	deleteCustomer: (customerId: string) => Promise<void>;
	customers: CustomerProps[];
	createTicket: (data: NewTicketData) => Promise<boolean>;
	getTickets: () => Promise<string>;
	ticketLimit: number;
	setLoadingApp: React.Dispatch<React.SetStateAction<boolean>>;
	tickets: TicketProps[];
	loadingApp: boolean;
	loadMoreBtn: boolean;
	getDetailTicket: (ticketId: string) => Promise<TicketProps | string>;
	loadMoreTickets: () => Promise<string>;
	setTicketLimit: React.Dispatch<React.SetStateAction<number>>;
	updateTicket: (data: UpdateTicketProps) => Promise<boolean>;
}

interface ProviderProps {
	children: ReactNode;
}

interface CreateTicketProps extends NewTicketData {
	createdByUserId: string;
	createdAt: Date;
	customerData: CustomerProps | null;
}

export interface TicketProps {
	id: string;
	customerData: CustomerProps | null;
	customerId: string;
	subjectOption: string;
	statusOption: string;
	description: string;
	createdAt: Timestamp;
}

export interface UpdateTicketProps {
	id: string;
	subjectOption: string;
	statusOption: string;
	description?: string;
}

export function AppContextProvider({ children }: ProviderProps) {
	const { user } = useContext(AuthContext)!;
	const [loadingApp, setLoadingApp] = useState(true);
	const [tickets, setTickets] = useState<TicketProps[] | []>([]);
	const [ticketLimit, setTicketLimit] = useState(5);
	const [loadMoreBtn, setLoadMoreBtn] = useState(false);
	const [lastTicket, setLastTicket] =
		useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [customers, setCustomers] = useState<CustomerProps[]>([]);
	useEffect(() => {
		const getData = async () => {
			await getTickets();
			setLoadingApp(false);
		};
		getData();
	}, []);
	async function createCustomer(data: CustomerData) {
		if (!data) {
			toast.error(
				"Nenhum dado foi carregado, gentileza verificar se todos os campos estão preenchidos e tentar novamente!"
			);
			return false;
		}
		if (!user) {
			toast.error("Acesso negado, não possui usuario registrado.");
			return false;
		}
		try {
			const customer = {
				cnpj: data.cnpj,
				address: data.address,
				name: data.name,
				createdByUserId: user.uid,
				createdAt: new Date(),
			};
			await addDoc(collection(db, "customers"), customer);
			await loadCustomer();
			return true;
		} catch (error) {
			return false;
		}
	}
	async function deleteCustomer(customerId: string) {
		if (!customerId) return;
		try {
			await deleteDoc(doc(db, "customers", customerId));
			await loadCustomer();
			toast.success("Cliente deletado com sucesso!");
		} catch (error) {
			toast.error("Erro ao deletar o cliente.");
		}
	}
	async function loadCustomer() {
		try {
			const customerList: CustomerProps[] = [];
			const q = await getDocs(collection(db, "customers"));
			if (q.empty) {
				setCustomers([]);
				return;
			}
			q.forEach((doc) => {
				customerList.push({
					id: doc.id,
					...doc.data(),
				} as CustomerProps);
			});
			setCustomers(customerList);
		} catch (error) {
			toast.error("Erro ao carregar os clientes.");
		}
	}
	async function createTicket(data: NewTicketData) {
		if (!data) return false;
		try {
			if (!user) {
				toast.error("Acesso negado, não possui usuario registrado.");
				return false;
			}
			function findCustomer(customerId: string) {
				return customers.find((customer) => customer.id === customerId) || null;
			}
			const ticket: CreateTicketProps = {
				...data,
				customerData: findCustomer(data.customerId),
				createdAt: new Date(),
				createdByUserId: user.uid,
			};
			await addDoc(collection(db, "tickets"), ticket);
			await getTickets();
			toast.success("Chamado criado com sucesso.");
			return true;
		} catch (error) {
			toast.error("Erro ao abrir o chamado.");
			return false;
		}
	}
	async function getTickets() {
		try {
			const newTickets: TicketProps[] = [];
			const ticketQuery = query(
				collection(db, "tickets"),
				where("statusOption", "!=", "Finalizado"),
				orderBy("statusOption", "desc"),
				limit(ticketLimit)
			);
			const q = await getDocs(ticketQuery);
			if (q.empty) {
				setTickets([]);
				return "sem-chamados";
			}
			q.forEach((doc) => {
				newTickets.push({ id: doc.id, ...doc.data() } as TicketProps);
			});
			setTickets(newTickets);
			setLastTicket(q.docs[q.docs.length - 1]);
			setLoadMoreBtn(true);
			return "chamados-atualizados";
		} catch (error) {
			toast.error("Erro ao buscar os chamados.");
			return "erro-chamados";
		}
	}
	async function loadMoreTickets() {
		if (!lastTicket) return "sem-chamados";
		try {
			const newTickets: TicketProps[] = [];
			const ticketQuery = query(
				collection(db, "tickets"),
				where("statusOption", "!=", "Finalizado"),
				orderBy("statusOption", "desc"),
				startAfter(lastTicket),
				limit(ticketLimit)
			);
			const q = await getDocs(ticketQuery);
			if (q.empty) {
				setLoadMoreBtn(false);
				return "sem-chamados";
			}
			q.forEach((doc) => {
				newTickets.push({ id: doc.id, ...doc.data() } as TicketProps);
			});
			setTickets((prev) => [...prev, ...newTickets]);
			setLastTicket(q.docs[q.docs.length - 1]);
			return "chamados-atualizados";
		} catch (error) {
			toast.error("Erro ao buscar os chamados.");
			return "erro-chamados";
		}
	}
	async function getDetailTicket(ticketId: string) {
		if (!ticketId) return "sem-id";
		try {
			const response = await getDoc(doc(db, "tickets", `${ticketId}`));
			if (!response.exists) {
				toast.error(`Não foi encontrado dados para o chamado ${ticketId}`);
				return "id-invalido";
			}
			let data = response.data() as TicketProps;
			const ticketInfo = {
				id: data.id,
				customerData: data.customerData,
				customerId: data.customerId,
				subjectOption: data.subjectOption,
				statusOption: data.statusOption,
				description: data.description,
				createdAt: data.createdAt,
			};
			return ticketInfo;
		} catch (error) {
			return "erro-busca";
		}
	}
	async function updateTicket(data: UpdateTicketProps) {
		if (!data) return false;
		try {
			console.log(data);
			const { id, statusOption, subjectOption, description } = data;
			await updateDoc(doc(db, "tickets", `${id}`), {
				statusOption,
				subjectOption,
				description,
				updatedAt: new Date(),
			});
			await getTickets();
			toast.success("Chamado atualizado com sucesso.");
			return true;
		} catch (error) {
			return false;
		}
	}
	return (
		<AppContext.Provider
			value={{
				createCustomer,
				customers,
				loadCustomer,
				deleteCustomer,
				createTicket,
				getTickets,
				ticketLimit,
				setTicketLimit,
				tickets,
				loadingApp,
				setLoadingApp,
				loadMoreTickets,
				loadMoreBtn,
				updateTicket,
				getDetailTicket,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
