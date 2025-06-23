const fetchBannerImageController = require('../controllers/fetchBannerImageController');

function handleBannerFetch(request,response)
{
  if(request.method === "GET" && request.url === "/api/fetchBannerImage")
  {
    // delegating to the controller to do the task fo fetching the image
    fetchBannerImageController(request,response);
  }
}
module.exports = handleBannerFetch;