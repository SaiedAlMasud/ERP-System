export const USER_ROLES = Object.freeze({
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  HR_MANAGER: "hr_manager",
  INVENTORY_MANAGER: "inventory_manager",
  SALES_MANAGER: "sales_manager",
  PURCHASE_MANAGER: "purchase_manager",
  ACCOUNTANT: "accountant",
  EMPLOYEE: "employee",
});

export const USER_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
});

export const PASSWORD_SALT_ROUNDS = 10;