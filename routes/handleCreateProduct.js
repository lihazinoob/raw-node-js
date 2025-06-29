const createProductController = require('../controllers/createProductController');
function handleCreateProduct(request,response)
{
  if(request.method === "POST" && request.url === "/api/createProduct")
  {
    // delegating to the controller to do the task of creating a product
    createProductController(request,response);
  }
}
module.exports = handleCreateProduct;