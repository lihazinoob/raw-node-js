const cloudinaryClient = require("cloudinary").v2;

cloudinaryClient.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});
module.exports = cloudinaryClient;