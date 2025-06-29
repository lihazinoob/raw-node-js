// list of allowed origins associated with the projects.
// Add or delete origins as needed.
// Recommended to remove the origins that are not now in use.1
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://on-bazar-admin-panel-front-end-rqqu.vercel.app",
  "https://on-bajar-front-end.vercel.app",
]

function applyCORS(request,response)
{
  const origin = request.headers.origin;
  if(allowedOrigins.includes(origin))
  {
    // set the header of the response to allow the origin
    response.setHeader("Access-Control-Allow-Origin", origin);
  }
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Content-Type", "application/json");
}
// function for handling the preflight request
function handlePreflight(request,response)
{
  applyCORS(request, response);
  response.writeHead(204);
  response.end();
}
module.exports = {
  applyCORS,
  handlePreflight
}