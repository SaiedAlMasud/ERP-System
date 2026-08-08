import User from "../users/user.model.js";
import { USER_ROLES, USER_STATUS } from "../users/user.constants.js";

class DashboardService {
  async getOverview() {
    const [
      totalUsers,
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      suspendedEmployees,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: USER_ROLES.EMPLOYEE,
      }),

      User.countDocuments({
        role: USER_ROLES.EMPLOYEE,
        status: USER_STATUS.ACTIVE,
      }),

      User.countDocuments({
        role: USER_ROLES.EMPLOYEE,
        status: USER_STATUS.INACTIVE,
      }),

      User.countDocuments({
        role: USER_ROLES.EMPLOYEE,
        status: USER_STATUS.SUSPENDED,
      }),
    ]);

    return {
      users: {
        total: totalUsers,
      },

      employees: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees,
        suspended: suspendedEmployees,
      },

      customers: null,
      products: null,
      inventory: null,
      sales: null,
      purchases: null,
      finance: null,
      attendance: null,
    };
  }
}

const dashboardService = new DashboardService();

export default dashboardService;