import { z } from "zod";

export const newTicketSchema = z.object({
	customerId: z.string().nonempty("O campo de cliente é obrigatorio"),
	subjectOption: z.string().nonempty("O campo de assunto é obrigatorio"),
	statusOption: z.string().nonempty("O campo de status é obrigatorio"),
	description: z.string().optional(),
});

export type NewTicketData = z.infer<typeof newTicketSchema>;
