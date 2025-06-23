const http = require("http");
const handleRegister = require("./routes/register");
const handleBannerImageUpload = require("./routes/bannerImageUpload");
const handleBannerFetch = require("./routes/bannerImageFetch");

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/register")) {
    handleRegister(req, res);
  } else if (req.url.startsWith("/api/uploadBannerImage")) {
    handleBannerImageUpload(req, res);
  }
  else if(req.url.startsWith("/api/fetchBannerImage"))
  {
    // delegating the task of fetching the banner image to the route 
    handleBannerFetch(req,res);
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
