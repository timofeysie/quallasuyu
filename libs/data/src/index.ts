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
