import ApiResponse from "../../shared/utils/ApiResponse.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import dashboardService from "./dashboard.service.js";

export const getDashboardOverview = asyncHandler(
  async (req, res) => {
    const overview =
      await dashboardService.getOverview();

    return res.status(200).json(
      new ApiResponse(
        true,
        "Dashboard overview fetched successfully.",
        overview
      )
    );
  }
);