const deleteCategoryInformationByIdController = require("../controllers/deleteCategoryInformationByIdController");

function handleCategoryInformationDelete(request,response)
{
  // console.log("Handling category information fetch by ID in handleCategoryInformationFetchById.js");
  const urlParts = request.url.split("/");
  if(request.method === "DELETE" && urlParts[1] === "api" && urlParts[2] === "deleteCategoryInformation" && urlParts[3])
  {
    // Extract the category ID from the URL
    const categoryId = urlParts[3];
    // typecast the categoryId to number
    const categoryIdNumber = parseInt(categoryId,10);
    deleteCategoryInformationByIdController(request,response,categoryIdNumber);
    
  }
  else{
    // If the request is not a GET request to /api/fetchCategoryById, send a 404 response
    response.statusCode = 404;
    return response.end("Not Found");
  }
}
module.exports = handleCategoryInformationDelete;