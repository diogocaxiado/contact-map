import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  emailOrPhone: z.union([
    z.string().email("Email inválido"),
    z.string().regex(/^\d{10,11}$/, "Telefone inválido (10 ou 11 dígitos)")
  ]),
  cep: z.string().length(8, "CEP deve ter 8 dígitos"),
  street: z.string().min(1, "Campo obrigatório"),
  number: z.string().min(1, "Campo obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Campo obrigatório"),
  city: z.string().min(1, "Campo obrigatório"),
  state: z.string().length(2, "UF deve ter 2 caracteres")
});

export type ContactFormData = z.infer<typeof contactSchema>;