const updateProductInformationController = require("../controllers/updateProductInformationController");

function handleProductInformationUpdate(request,response) {

  // Split the URL into parts
  const urlParts = request.url.split("/")
  if(request.method === "PUT" &&  urlParts[1] === "api" && urlParts[2] === "updateProduct" && urlParts[3]) {
    // Extract the product ID from the URL
    const productId = urlParts[3];
    // typecast the productId to number
    const productIdNumber = parseInt(productId, 10);
    updateProductInformationController(request, response, productIdNumber);
  }
  else
  {
    // If the request is not a PUT request to /api/updateProduct, send a 404 response
    response.statusCode = 404;
    return response.end("Not Found");
  }
}
module.exports = handleProductInformationUpdate;