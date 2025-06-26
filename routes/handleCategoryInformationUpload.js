const uploadCategoryInformationController = require("../controllers/uploadCategoryInformationController");

function handleCategoryInformationUpload(request,response)
{
  if(request.method === "POST" && request.url === "/api/uploadCategoryInformation")
  {
    uploadCategoryInformationController(request,response);  
  }
  
}
module.exports = handleCategoryInformationUpload;