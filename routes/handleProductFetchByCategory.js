const fetchProductsByCategoryController = require("../controllers/fetchProductsByCategoryController");

function handleProductFetchByCategory(request, response) {
  const parsedURL = require("url").parse(request.url, true);
  const pathnameParts = parsedURL.pathname.split("/");

  if (
    request.method === "GET" &&
    pathnameParts[1] === "api" &&
    pathnameParts[2] === "fetchProductsByCategory" &&
    pathnameParts[3]
  ) {
    const categorySlug = pathnameParts[3]; // ✅ This now excludes ?page=1
    fetchProductsByCategoryController(request, response, categorySlug);
  } else {
    response.statusCode = 404;
    return response.end("Not Found");
  }
}

module.exports = handleProductFetchByCategory;
