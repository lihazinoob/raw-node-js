const supabaseClient = require("../lib/supabaseClient");
async function fetchAllCategoryInformationController(request, response) {
  // solving the CORS issue
  const allowedOrigin = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "https://on-bazar-admin-panel-front-end-rqqu.vercel.app",
  ];

  // fetching the origin from the request headers
  const origin = request.headers.origin;
  // checking if the origin is in the allowed origins list
  if (allowedOrigin.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
  }

  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.writeHead(204); // No Content
    response.end();
    return;
  }
  // trying to fetch the data from the supabase
  const { data, error } = await supabaseClient.from("category").select("*");

  // error handling
  if (error) {
    response.statusCode = 500;
    return response.end(
      JSON.stringify({
        error: "Error fetching data from database",
        message: response.error.message,
      })
    );
  }
  // sending the response
  response.statusCode = 200;
  return response.end(
    JSON.stringify({
      categoryInformation: data,
      message: "Category information fetched successfully",
    })
  );
  //  ================================= JSON will look like this

  // {
  //   "categoryInformation": [
  //       {
  //           "id": 6,
  //           "created_at": "2025-06-26T05:26:56.712097+00:00",
  //           "category_name": "Jersey",
  //           "category_description": "Hello World",
  //           "category_image": "https://res.cloudinary.com/ddukqnbjm/image/upload/v1750916718/categoryImages/uwbcgxju9cqre16qkmre.jpg"
  //       },
  //       {
  //           "id": 7,
  //           "created_at": "2025-06-26T13:16:11.671704+00:00",
  //           "category_name": "Trouser",
  //           "category_description": "Lorem ipsum dolor sit amet.",
  //           "category_image": "https://res.cloudinary.com/ddukqnbjm/image/upload/v1750943770/categoryImages/np8pep2u9ba3xj6d8hrr.jpg"
  //       },
  //       {
  //           "id": 10,
  //           "created_at": "2025-06-26T13:31:53.896058+00:00",
  //           "category_name": "Tshirts",
  //           "category_description": "Enjoy the Tshirts with cotton silk and smooth texture of garments",
  //           "category_image": "https://res.cloudinary.com/ddukqnbjm/image/upload/v1750944712/categoryImages/g30uyxony7f4mi5dj7gl.jpg"
  //       }
  //   ],
  //   "message": "Category information fetched successfully"
  // }
}
module.exports = fetchAllCategoryInformationController;
