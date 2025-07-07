const fetchPriceRangesofCategoryController = require("../controllers/fetchPriceRangesofCategoryController");
function handleFetchPriceRangesofCategory(request, response) {
  const urlParts = request.url.split("/");
  if (
    request.method === "GET" &&
    urlParts[1] === "api" &&
    urlParts[2] === "fetchPriceRangesofCategory"
  ) {
    const slugWithQuery = urlParts[3];
    const slug = slugWithQuery.split("?")[0]; // Extract slug before any query parameters
    if (!slug) {
      response.statusCode = 400;
      return response.end(JSON.stringify({ error: "Missing category slug" }));
    }
    fetchPriceRangesofCategoryController(
      request,
      response,
      slug
    );
  }

  else{
    response.statusCode = 404;
    return response.end(JSON.stringify({ error: "Not Found" }));
  }
}
module.exports = handleFetchPriceRangesofCategory;  
