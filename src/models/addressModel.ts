export interface Address {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string | null;
  latitude: number;
  longitude: number;
}
