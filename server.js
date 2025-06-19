
const http = require("http");
const handleRegister = require("./routes/register");


const server = http.createServer(async(req, res) => {
  handleRegister(req,res);
  
});
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
