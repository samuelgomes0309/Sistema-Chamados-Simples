import { z } from "zod";

export const signinSchema = z.object({
	email: z.email("E-mail inválido"),
	password: z
		.string()
		.min(6, "Senha deve conter pelo menos 6 caracteres.")
		.nonempty("Senha obrigatória"),
});

export const signupSchema = z.object({
	name: z.string().nonempty("Nome obrigatório"),
	email: z.email("E-mail inválido"),
	password: z
		.string()
		.min(6, "Senha deve conter pelo menos 6 caracteres.")
		.nonempty("Senha obrigatória"),
});

export type SigninData = z.infer<typeof signinSchema>;
export type SignupData = z.infer<typeof signupSchema>;
