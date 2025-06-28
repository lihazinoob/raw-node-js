const supabaseClient = require("../lib/supabaseClient");
async function deleteCategoryInformationByIdController(
  request,
  response,
  categoryId
) {
  // solving the CORS issue
  const allowedOrigin = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "https://on-bazar-admin-panel-front-end-rqqu.vercel.app",
    "https://on-bajar-front-end.vercel.app",
  ];

  // fetching the origin from the request headers
  const origin = request.headers.origin;
  // checking if the origin is in the allowed origins list
  if (allowedOrigin.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
  }

  response.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Content-Type", "application/json");

  if (request.method === "OPTIONS") {
    response.writeHead(204); // No Content
    response.end();
    return;
  }

  // validate if the categoryId is a number and if it is greater than 0
  if (isNaN(categoryId) && categoryId <= 0) {
    response.statusCode = 400;
    return response.end(
      JSON.stringify({
        error: "Invalid category ID",
        message: "Category ID must be a positive number",
      })
    );
  }

  // deleting the data from supabase
  try {
    const { data, error } = await supabaseClient
      .from("category")
      .delete()
      .eq("id", categoryId);

    // error handling
    if (error) {
      response.statusCode = 500;
      return response.end(
        JSON.stringify({
          error: "Error deleting data from database",
          message: error.message,
        })
      );
    }
    // sending the response
    response.statusCode = 200;
    return response.end(
      JSON.stringify({
        message: "Category information deleted successfully",
      })
    );
  } catch (error) {
    response.statusCode = 500;
    return response.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      })
    );
  }
}
module.exports = deleteCategoryInformationByIdController;
