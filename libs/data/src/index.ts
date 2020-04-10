export interface Todo {
  title: string;
}
export interface Authenticate {
  username: string;
  password: string;
}

export interface User {
  username: string;
  id: number;
  country: string;
  token: string;
  role: string;
}

export interface Product {
  name: string;
  category: string;
  id: number;
}
