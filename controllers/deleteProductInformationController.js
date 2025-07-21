const { applyCORS, handlePreflight } = require("../utils/corsHelper");
const supabaseClient = require("../lib/supabaseClient");

function deleteProductInformationController(request, response, productId) {
  applyCORS(request, response);

  // Handle preflight
  if (request.method === "OPTIONS") {
    return handlePreflight(request, response);
  }

  // Validate productId
  if (isNaN(productId) || productId <= 0) {
    response.statusCode = 400;
    return response.end(
      JSON.stringify({
        error: "Invalid product ID",
        message: "Product ID must be a positive number",
      })
    );
  }

  // Delete product
  supabaseClient
    .from("products")
    .delete()
    .eq("id", productId)
    .then(({ data, error }) => {
      if (error) {
        response.statusCode = 500;
        return response.end(
          JSON.stringify({
            error: "Database Error",
            message: error.message,
          })
        );
      }

     

      response.statusCode = 200;
      response.end(
        JSON.stringify({
          message: "Product deleted successfully",
          
        })
      );
    })
    .catch((err) => {
      response.statusCode = 500;
      return response.end(
        JSON.stringify({
          error: "Server Error",
          message: err.message,
        })
      );
    });
}

module.exports = deleteProductInformationController;
