export const Role = {
    TENANT: 'tenant',
    OWNER: 'owner',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
};

export const RoleLabels = {
    [Role.TENANT]: 'Tenant',
    [Role.OWNER]: 'Property Owner',
    [Role.ADMIN]: 'Admin',
    [Role.SUPER_ADMIN]: 'Super Admin'
};

export const RegistrationRoles = [
    { value: Role.TENANT, label: RoleLabels[Role.TENANT] },
    { value: Role.OWNER, label: RoleLabels[Role.OWNER] }
];