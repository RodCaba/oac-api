import { RolesBuilder } from 'nest-access-control';
import { Roles } from './enums/roles';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

// prettier-ignore
RBAC_POLICY
  .grant(Roles.USER)
    .readOwn('projects')
    .readOwn('tasks')
  .grant(Roles.MANAGER)
    .extend(Roles.USER)
    .createAny('tasks')
    .readAny('tasks')
    .updateOwn('tasks')
  .grant(Roles.ADMIN)
    .extend(Roles.MANAGER)
    .createAny('projects')
    .updateOwn('projects')
    .deleteOwn('projects')
