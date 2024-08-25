export enum UserRoles {
  admin = "admin",
  manager = "manager",
  restricted = "restricted",
}

export const RoleArray = [UserRoles.admin, UserRoles.manager, UserRoles.restricted];

export const RoleLabel = {
  [UserRoles.admin]: "Admin",
  [UserRoles.manager]: "Manager",
  [UserRoles.restricted]: "Restricted",
};
