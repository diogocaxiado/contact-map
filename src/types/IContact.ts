export interface IContact {
  id: string;
  name: string;
  emailOrPhone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}