export const hasModulePermission =
  (moduleName: string, permission: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (modules: any[]): boolean =>
    modules.some(
      (m) => m.name === moduleName && m.permissions.includes(permission)
    );
