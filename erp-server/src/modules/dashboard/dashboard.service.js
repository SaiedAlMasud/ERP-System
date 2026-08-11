import User from "../users/user.model.js";
import Employee from "../employees/employee.model.js";
import { USER_STATUS } from "../users/user.constants.js";
import {
  EMPLOYEE_STATUS,
} from "../employees/employee.constants.js";
import Product from "../products/product.model.js";

class DashboardService {
  async getOverview() {
    const [
      totalUsers,
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      onLeaveEmployees,
      terminatedEmployees,
      totalProducts,
    ] = await Promise.all([
      User.countDocuments(),

      Employee.countDocuments(),

      Employee.countDocuments({
        status: EMPLOYEE_STATUS.ACTIVE,
      }),

      Employee.countDocuments({
        status: EMPLOYEE_STATUS.INACTIVE,
      }),

      Employee.countDocuments({
        status: EMPLOYEE_STATUS.ON_LEAVE,
      }),

      Employee.countDocuments({
        status: EMPLOYEE_STATUS.TERMINATED,
      }),

      Product.countDocuments(),
    ]);

    return {
      users: {
        total: totalUsers,
      },

      employees: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees,
        onLeave: onLeaveEmployees,
        terminated: terminatedEmployees,
      },

      customers: null,
      products: {
        total: totalProducts,
      },
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