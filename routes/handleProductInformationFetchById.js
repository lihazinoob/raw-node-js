const fetchProductInformationByIdController = require("../controllers/fetchProductInformationByIdController");

function handleProductInformationFetchById(request,response) {
  const urlParts = request.url.split("/");
  if(request.method === "GET" &&  urlParts[1] === "api" && urlParts[2] === "fetchProductById" && urlParts[3]) {
    // Extract the product ID from the URL
    const productId = urlParts[3];
    // typecast the productId to number
    const productIdNumber = parseInt(productId, 10);
    
    // Call the controller function with the request, response, and product ID
    fetchProductInformationByIdController(request, response, productIdNumber);
  }
  else{
    // If the request is not a GET request to /api/fetchProductById, send a 404 response
    response.statusCode = 404;
    return response.end("Not Found");
  }
}
module.exports = handleProductInformationFetchById;