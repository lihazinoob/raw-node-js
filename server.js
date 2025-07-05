const http = require("http");
const handleRegister = require("./routes/register");
const handleBannerImageUpload = require("./routes/bannerImageUpload");
const handleBannerFetch  = require("./routes/handleBannerFetch");
const handleCategoryInformationUpload = require("./routes/handleCategoryInformationUpload");
const handleCategoryInformationUpdate = require("./routes/handleCategoryInformationUpdate");
const handleAllCategoryInformationFetch = require("./routes/handleAllCategoryInformationFetch");
const handleCategoryInformationFetchById = require("./routes/handleCategoryInformationFetchById");
const handleCategoryInformationDelete = require("./routes/handleCategoryInformationDelete");
const handleCreateProduct = require("./routes/handleCreateProduct");
const handleFetchAllProducts = require("./routes/handleFetchAllProducts");
const handleProductFetchByCategory = require("./routes/handleProductFetchByCategory");


const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/register")) {
    handleRegister(req, res);
  } 
  else if (req.url.startsWith("/api/uploadBannerImage")) {
    handleBannerImageUpload(req, res);
  }

  else if(req.url.startsWith("/api/fetchBannerImage"))
  {
    // delegating the task of fetching the banner image to the route 
    handleBannerFetch(req,res);
  }
  else if(req.url.startsWith("/api/uploadCategoryInformation"))
  {
    handleCategoryInformationUpload(req,res);
  }
  else if(req.url.startsWith("/api/updateCategoryInformation"))
  {
    handleCategoryInformationUpdate(req,res);
  }
  else if(req.url.startsWith("/api/fetchAllCategoryInformation"))
  {
    
    handleAllCategoryInformationFetch(req,res);
  }
  else if(req.url.startsWith("/api/fetchCategoryById"))
  {
    // console.log("Handling category information fetch by ID in server.js");
    handleCategoryInformationFetchById(req,res);
  }
  else if(req.url.startsWith("/api/deleteCategoryInformation"))
  {
    handleCategoryInformationDelete(req,res);
  }
  else if(req.url.startsWith("/api/createProduct"))
  {
    handleCreateProduct(req,res);
  }
  else if(req.url.startsWith("/api/fetchAllProducts"))
  {
    handleFetchAllProducts(req,res);
  }
  else if(req.url.startsWith("/api/fetchProductsByCategory"))
  {
    handleProductFetchByCategory(req,res);
  }
  else {
    // If the request is not a POST request to /register, send a 404 response
    res.statusCode = 404;
    res.end("Not Found");
  }
});
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
