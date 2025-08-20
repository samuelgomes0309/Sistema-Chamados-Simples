import { useContext, useMemo, useState } from "react";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../contexts/auth.context";
import Input from "../../components/input";
import { useForm, type FieldErrors } from "react-hook-form";
import {
	signinSchema,
	signupSchema,
	type SigninData,
	type SignupData,
} from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type loginSchema = SigninData | SignupData;
type FormData = loginSchema;
type FormType = "login" | "signup";

export default function Login() {
	const { handleSignIn, handleSignUp } = useContext(AuthContext)!; //obs o ! força dizendo que não é undefined
	const [isLogin, setIslogin] = useState<boolean>(true);
	const [formType, setFormType] = useState<FormType>("login");
	const nav = useNavigate();
	const schema = useMemo(() => {
		return formType === "login" ? signinSchema : signupSchema;
	}, [formType]);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<SigninData | SignupData>({
		resolver: zodResolver(schema),
	});
	function handleStatusLogin() {
		setIslogin((prev) => {
			const newState = !prev;
			setFormType(newState ? "login" : "signup");
			reset();
			return newState;
		});
	}
	function ErrorMessage({ message }: { message?: string }) {
		return (
			<p className="w-full max-w-96 font-semibold text-red-500 transition-all duration-500">
				{message}
			</p>
		);
	}
	async function onSubmit(data: FormData) {
		if (data === null) return;
		if (isLogin) {
			const login = await handleSignIn(data);
			if (login) {
				toast.success("Logado com sucesso!");
				nav("/dashboard");
				return;
			}
		} else if (!isLogin && formType === "signup") {
			const signup = await handleSignUp(data as SignupData);
			if (signup) {
				toast.success("Conta criada com sucesso!");
				return;
			}
		}
	}
	return (
		<>
			<main className="flex h-dvh w-dvw bg-zinc-900 p-8">
				<section className="mx-auto my-auto flex w-full max-w-xl flex-col rounded-t-3xl rounded-b-3xl bg-neutral-300">
					<div className="flex items-center justify-center rounded-t-2xl bg-gradient-to-bl from-indigo-800 to-blue-700 px-2.5 py-4">
						<img
							className="h-[80px] w-28 select-none"
							src={logo}
							alt="Logo do app"
						/>
					</div>
					<div className="flex w-full flex-col items-center justify-center px-5 py-10">
						<form
							key={formType}
							className="flex w-full flex-col items-center justify-center"
							onSubmit={handleSubmit(onSubmit)}
						>
							{formType === "signup" && (
								<>
									<Input
										{...register("name")}
										placeholder="Nome"
										type="text"
										autoComplete="off"
										errors={
											(errors as FieldErrors<SignupData>).name?.message
												? true
												: false
										}
									/>
									<ErrorMessage
										message={(errors as FieldErrors<SignupData>).name?.message}
									/>
								</>
							)}
							<Input
								placeholder="Email"
								type="email"
								autoComplete="email"
								{...register("email")}
								errors={errors.email?.message ? true : false}
							/>
							<ErrorMessage message={errors.email?.message} />
							<Input
								type="password"
								autoComplete="new-password"
								placeholder="Senha"
								{...register("password")}
								errors={errors.password?.message ? true : false}
							/>
							<ErrorMessage message={errors.password?.message} />
							<button
								type="submit"
								className="mt-3 mb-3 h-10 w-full max-w-96 cursor-pointer rounded-sm border-gray-400 bg-blue-950 py-1 text-xl font-bold text-white transition-all duration-500 hover:border-2 hover:bg-blue-800"
							>
								{isLogin ? "Acessar" : "Cadastrar"}
							</button>
						</form>
						<button
							type="button"
							onClick={handleStatusLogin}
							className="cursor-pointer text-gray-500 transition-all duration-500 hover:text-black"
						>
							{isLogin ? "Criar uma nova conta" : "Realizar o login"}
						</button>
					</div>
				</section>
			</main>
		</>
	);
}
