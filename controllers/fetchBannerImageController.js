const supabaseClient = require("../lib/supabaseClient");
async function fetchBannerImageController(request, response) {
  // solving the CORS issue
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // or "*"
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.writeHead(204); // No Content
    response.end();
    return;
  }

  // fetching the image url from supabase
  try {
    const { data, error } = await supabaseClient
      .from("bannerImages")
      .select("imageURL")
      .single();

    // error handling
    if (error) {
      response.statusCode = 500;
      response.end(JSON.stringify({
        error:"Error fetching data from database",
        message:error.message
      }));
      return;
    }
    response.statusCode = 200;
    response.end(JSON.stringify({
      data,
      message:"Image is fetched successfully from database"
    }));
  } catch (error) {
    response.statusCode = 500;
    response.end(JSON.stringify({
      error:"There was an unexpected problem setting connection to the database",
      message:error.message
    }));
  }

  
}
module.exports = fetchBannerImageController;
