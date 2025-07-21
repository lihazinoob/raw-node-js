const deleteCategoryInformationByIdController = require("../controllers/deleteCategoryInformationByIdController");

function handleCategoryInformationDelete(request, response) {
  const urlParts = request.url.split("/");

  const isMatchingPath =
    urlParts[1] === "api" &&
    urlParts[2] === "deleteCategoryInformation" &&
    urlParts[3];


  if (request.method === "OPTIONS" && isMatchingPath) {
    const origin = request.headers.origin;
    const allowedOrigin = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "https://on-bazar-admin-panel-front-end-rqqu.vercel.app",
      "https://on-bajar-front-end.vercel.app",
    ];

    if (allowedOrigin.includes(origin)) {
      response.setHeader("Access-Control-Allow-Origin", origin);
    }

    response.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.writeHead(204);
    response.end();
    return;
  }

 
  if (request.method === "DELETE" && isMatchingPath) {
    const categoryId = parseInt(urlParts[3], 10);
    return deleteCategoryInformationByIdController(request, response, categoryId);
  }


  response.statusCode = 404;
  response.end("Not Found");
}

module.exports = handleCategoryInformationDelete;
