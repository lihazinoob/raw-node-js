const fetchCategoryInformationByIdController = require("../controllers/fetchCategoryInformationByIdController");

function handleCategoryInformationFetchById(request,resposne)
{
  // console.log("Handling category information fetch by ID in handleCategoryInformationFetchById.js");
  const urlParts = request.url.split("/");
  if(request.method === "GET" && urlParts[1] === "api" && urlParts[2] === "fetchCategoryById" && urlParts[3])
  {
    // Extract the category ID from the URL
    const categoryId = urlParts[3];
    // typecast the categoryId to number
    const categoryIdNumber = parseInt(categoryId,10);
    fetchCategoryInformationByIdController(request,resposne,categoryIdNumber);
    
  }
  else{
    // If the request is not a GET request to /api/fetchCategoryById, send a 404 response
    resposne.statusCode = 404;
    return resposne.end("Not Found");
  }
}
module.exports = handleCategoryInformationFetchById;