export class CreateUserDTO {
  readonly _id: number;
  readonly username: string;
  readonly password: string;
}

export class EditUserDTO {
  readonly username: string;
  readonly password: string;
}
