import { z } from "zod";

export const editingTicketSchema = z.object({
	subjectOption: z.string().nonempty("O campo de assunto é obrigatorio"),
	statusOption: z.string().nonempty("O campo de status é obrigatorio"),
	description: z.string().optional(),
});

export type EditingTicketData = z.infer<typeof editingTicketSchema>;
