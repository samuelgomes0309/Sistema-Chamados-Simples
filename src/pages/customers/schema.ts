import { z } from "zod";

export const customerSchema = z.object({
	name: z
		.string()
		.nonempty("O nome é obrigatório")
		.min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
	cnpj: z
		.string()
		.regex(/^\d+$/, "O CNPJ deve conter apenas números")
		.length(14, "O CNPJ deve conter exatamente 14 dígitos"),
	address: z.string().nonempty("O endereço é obrigatório"),
});

export type CustomerData = z.infer<typeof customerSchema>;
