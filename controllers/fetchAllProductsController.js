const supabaseClient = require("../lib/supabaseClient");
const { applyCORS, handlePreflight } = require("../utils/corsHelper");
const url = require("url");
const PAGE_SIZE = 10; // Number of products to fetch per page

async function fetchAllProductsController(request, response) {
  if (request.method === "OPTIONS") {
    handlePreflight(request, response);
  }

  applyCORS(request, response);

  // parse the url to get the query parameter of page information
  const parsedURL = url.parse(request.url, true);
  const page = parseInt(parsedURL.query.page) || 1; // Default to page 1 if not provided
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // fetch all the product information from the supabase
  const { data,count, error } = await supabaseClient
    .from("products")
    .select("*", {
      count: "exact",
    })
    .range(from, to)
    .order("created_at", { ascending: false });
  // error handling
  if (error) {
    response.statusCode = 500;
    return response.end(
      JSON.stringify({
        error: "Error fetching products from the database",
        message: error.message,
      })
    );
  }
  const totalPages = Math.ceil(count / PAGE_SIZE);

  // sending the response
  response.statusCode = 200;
  return response.end(
    JSON.stringify({
      currentPage: page,
      totalPages: totalPages,
      totalProducts: count,
      products: data,
      message: "Products fetched successfully",
    })
  );

  //===============================The JSON response will look like this================================
  //   {
  //     "products": [
  //         {
  //             "id": 1,
  //             "created_at": "2025-06-29T16:58:17.777563+00:00",
  //             "product_name": "[\"Super Cool T-Shirt\"]",
  //             "product_description": "[\"100% cotton, very soft and comfortable.\"]",
  //             "product_price": 30.99,
  //             "product_sale_percentage": 12,
  //             "is_featured_product": false,
  //             "is_new_product": false,
  //             "product_quantity": 122,
  //             "product_colors": [
  //                 "#FF0000",
  //                 "#00FF00",
  //                 "#0000FF"
  //             ],
  //             "product_category_id": 6,
  //             "is_sold_out": false,
  //             "product_image": "https://res.cloudinary.com/ddukqnbjm/image/upload/v1751216296/productImages/usynbga8hvx4kcmh83ho.jpg"
  //         }
  //     ],
  //     "message": "Products fetched successfully"
  // }
}
module.exports = fetchAllProductsController;
