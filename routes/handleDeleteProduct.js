const deleteProductInformationController = require("../controllers/deleteProductInformationController");

function handleDeleteProduct(req, res) {
  const urlParts = req.url.split("/");

  if (
    (req.method === "DELETE" || req.method === "OPTIONS") &&
    urlParts[1] === "api" &&
    urlParts[2] === "deleteProduct" &&
    urlParts[3]
  ) {
    const productId = parseInt(urlParts[3], 10);
    return deleteProductInformationController(req, res, productId);
  }

  res.statusCode = 404;
  res.end("Not Found");
}

module.exports = handleDeleteProduct;
