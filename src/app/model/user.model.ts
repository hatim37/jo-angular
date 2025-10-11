export class User {
  id: number | undefined;
  name: string| undefined;
  username: string| undefined;
  email: string| undefined;
  password: string| undefined;
}

export interface activationCode {
  code: number;
}

export interface newCode {
  id: number;
}
