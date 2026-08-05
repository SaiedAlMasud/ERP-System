import ApiResponse from "../../shared/utils/ApiResponse.js";


export const healthCheck = (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      true,
      "ERP API is running"
    )
  );
};