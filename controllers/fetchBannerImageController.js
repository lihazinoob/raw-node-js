const supabaseClient = require("../lib/supabaseClient");
const {applyCORS,handlePreflight} = require("../utils/corsHelper")


async function fetchBannerImageController(request, response) {
  // solving the CORS issue
  if(request.method === "OPTIONS")
  {
    handlePreflight(request,response);
  }
  applyCORS(request, response);

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
