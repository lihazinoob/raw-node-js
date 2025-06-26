const fetchAllCategoryInformationController = require('../controllers/fetchAllCategoryInformationController');

function handleAllCategoryInformationFetch(request,response)
{
  if(request.method === "GET" && request.url === "/api/fetchAllCategoryInformation")
  {
    fetchAllCategoryInformationController(request,response);
  }
}
module.exports = handleAllCategoryInformationFetch;