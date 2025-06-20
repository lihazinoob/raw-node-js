const uploadBannerImageController = require('../controllers/uploadBannerImageController');
function handleBannerImageUpload(req,res)
{
  if(req.method === "POST" && req.url === "/api/uploadBannerImage")
  {
    uploadBannerImageController(req,res);
  }
}
module.exports = handleBannerImageUpload;