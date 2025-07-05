const fetchProductsByCategoryController = require("../controllers/fetchProductsByCategoryController");
function handleProductFetchByCategory(request, response) {
  const urlParts = request.url.split("/");
  if (
    request.method === "GET" &&
    urlParts[1] === "api" &&
    urlParts[2] === "fetchProductsByCategory" &&
    urlParts[3]
  ) {
    const categorySlug = urlParts[3];
    if (!categorySlug) {
      response.statusCode = 404;
      return response.end("Missing slug in URL");
    }
    fetchProductsByCategoryController(request, response, categorySlug);
  } else {
    response.statusCode = 404;
    return response.end("Not Found");
  }
}
module.exports = handleProductFetchByCategory;
