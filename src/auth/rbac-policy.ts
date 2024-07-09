import { RolesBuilder } from 'nest-access-control';
import { Roles } from './enums/roles';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

// prettier-ignore
RBAC_POLICY
  .grant(Roles.USER)
    .readOwn('projects')
    .updateOwn('projects')
  .grant(Roles.ADMIN)
    .extend(Roles.USER)
    .createAny('projects')
    .deleteOwn('projects')
