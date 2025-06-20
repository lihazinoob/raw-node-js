// filtering out if the incoming request is a POST request to the /register endpoint
const registerController = require("../controllers/registerController");
function handleRegister(req,res)
{
  if (req.method === "POST" && req.url === "/register") {
    // Now need to parse the JSON body of the request
    registerController(req, res);
  }
  
}
module.exports = handleRegister;

