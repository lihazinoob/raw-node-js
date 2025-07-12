const fetchAllProductsController = require("../controllers/fetchAllProductsController");

function handleFetchAllProducts(request,response)
{
  const parsedURL = require("url").parse(request.url, true);
  const pathname = parsedURL.pathname;
  if(request.method === "GET" && pathname === "/api/fetchAllProducts")
  {
    fetchAllProductsController(request,response);
  }
  else{
    response.statusCode = 404;
    return response.end("Not Found");
  }
}
module.exports = handleFetchAllProducts;