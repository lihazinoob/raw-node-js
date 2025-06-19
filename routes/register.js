// filtering out if the incoming request is a POST request to the /register endpoint
const registerController = require("../controllers/registerController");
function handleRegister(req,res)
{
  if (req.method === "POST" && req.url === "/register") {
    // Now need to parse the JSON body of the request
    registerController(req, res);
  }
  else{
    // If the request is not a POST request to /register, send a 404 response
    res.statusCode = 404;
    res.end("Not Found");
  }
}
module.exports = handleRegister;

