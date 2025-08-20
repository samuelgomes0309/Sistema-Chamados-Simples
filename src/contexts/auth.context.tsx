import { createContext, useEffect, useState, type ReactNode } from "react";
import type { SigninData, SignupData } from "../pages/login/schemas";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from "firebase/auth";
import { auth, db } from "../services/firebase/api";
import { toast } from "react-toastify";
import {
	addDoc,
	collection,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";

interface AuthcontextValues {
	handleSignIn: (data: SigninData) => Promise<boolean>;
	handleSignUp: (data: SignupData) => Promise<boolean>;
	handleLogOut: () => Promise<void>;
	user: UserProps | null;
	signed: boolean;
	setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
	loadingAuth: boolean;
	updateProfileUser: (avatar: string | null, name: string) => Promise<void>;
}

interface UserProps {
	uid: string;
	name: string;
	email: string;
	avatarUrl: string | null;
}

export const AuthContext = createContext<AuthcontextValues | undefined>(
	undefined
);

interface ProviderProps {
	children: ReactNode;
}

export function AuthContextProvider({ children }: ProviderProps) {
	const [user, setUser] = useState<UserProps | null>(null);
	const [loadingAuth, setLoadingAuth] = useState(true);
	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			if (user) {
				const userProps: UserProps = {
					email: user?.email ?? "",
					name: user?.displayName ?? "",
					uid: user?.uid,
					avatarUrl: user?.photoURL ?? null,
				};
				setUser(userProps);
			} else {
				setUser(null);
			}
			setLoadingAuth(false);
		});
		return () => unsub();
	}, []);
	async function handleSignIn(data: SigninData) {
		try {
			const { email, password } = data;
			const response = await signInWithEmailAndPassword(auth, email, password);
			const userProps: UserProps = {
				email,
				name: response?.user?.displayName ?? "",
				uid: response?.user?.uid,
				avatarUrl: response?.user?.photoURL,
			};
			setUser(userProps);
			return true;
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Erro inesperado ao realizar o login";
			toast.error(message);
			return false;
		}
	}
	async function handleSignUp(data: SignupData) {
		try {
			const { email, name, password } = data;
			const response = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await updateProfile(response.user, { displayName: data?.name });
			const userProps = {
				email,
				name,
				uid: response?.user?.uid,
				avatarUrl: null,
				createdAt: new Date(),
			};
			await addDoc(collection(db, "users"), userProps);
			setUser(userProps);
			return true;
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Erro inesperado ao cadastrar";
			toast.error(message);
			return false;
		}
	}
	async function handleLogOut() {
		if (user === null) return;
		try {
			await signOut(auth);
			setUser(null);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Erro inesperado ao cadastrar";
			toast.error(message);
		}
	}
	async function updateProfileUser(avatar?: string | null, name?: string) {
		try {
			if (!user?.uid) return;
			const q = query(collection(db, "users"), where("uid", "==", user?.uid));
			const doc = await getDocs(q);
			const ref = doc.docs[0].ref;
			await updateDoc(ref, {
				name: name,
				avatarUrl: avatar ?? null,
			});
			setUser((prevUser) => {
				if (!prevUser) return null;
				return {
					...prevUser,
					name: name ?? prevUser.name,
					avatarUrl: avatar ?? null,
				};
			});
			const currentUser = auth.currentUser;
			if (currentUser) {
				await updateProfile(currentUser, {
					photoURL: avatar ?? null,
				});
			}
			toast.success("Perfil atualizado com sucesso!");
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Erro inesperado ao atualizar as informações";
			toast.error(message);
		}
	}
	return (
		<AuthContext.Provider
			value={{
				handleSignIn,
				handleSignUp,
				user,
				handleLogOut,
				signed: !!user,
				loadingAuth,
				setUser,
				updateProfileUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
