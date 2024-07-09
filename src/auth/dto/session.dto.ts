import { Roles } from '../enums/roles';

export class SessionDto {
  id: string;
  email: string;
  roles: Roles[];
}
