export interface Address {
  zipCode: string;
  city: string;
  street: string;
  country: string;
  state: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  address: Address;
}

export interface Site {
  id: string;
  clientId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  contacts: Record<string, Contact>;
  address: Address;
  images: string[];
  tags: string[];
}

export interface Client {
  id: string;
  givenName: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  givenName: string;
  locale: string;
  avatar: string;
}
