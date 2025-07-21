const { applyCORS, handlePreflight } = require("../utils/corsHelper");
const supabaseClient = require("../lib/supabaseClient");

async function fetchProductInformationByIdController(request,response,productId) {
  if (request.method === "OPTIONS") {
    handlePreflight(request, response);
  }

  applyCORS(request, response);

  
  if (isNaN(productId) || productId <= 0) {
    response.statusCode = 400;
    return response.end(
      JSON.stringify({
        error: "Invalid product ID",
        message: "Product ID must be a positive number",
      })
    );
  }

  // Now fetch the product information by ID
  try {
    const {data,error} =  await supabaseClient
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

      if (error) {
        response.statusCode = 500;
        return response.end(
          JSON.stringify({
            error: "Error fetching product information from database",
            message: error.message,
          })
        );
      }
    // Sending the successful response
    response.statusCode = 200;
    return response.end(
      JSON.stringify({
        productInformation: data,
        message: "Product information fetched successfully",
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

module.exports = fetchProductInformationByIdController;