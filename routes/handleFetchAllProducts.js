const fetchAllProductsController = require("../controllers/fetchAllProductsController");

function handleFetchAllProducts(request,response)
{
  if(request.method === "GET" && request.url === "/api/fetchAllProducts")
  {
    fetchAllProductsController(request,response);
  }
}
module.exports = handleFetchAllProducts;