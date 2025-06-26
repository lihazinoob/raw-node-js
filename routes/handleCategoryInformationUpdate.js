const updateCategoryInformationController = require("../controllers/updateCategoryInformationController");
function handleCategoryInformationUpdate(request,response)
{
  if(request.method === "POST" && request.url === "/api/updateCategoryInformation")
  {
    updateCategoryInformationController(request,response);
  }
}
module.exports = handleCategoryInformationUpdate;