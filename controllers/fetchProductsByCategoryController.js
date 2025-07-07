const { applyCORS, handlePreflight } = require("../utils/corsHelper");
const supabaseClient = require("../lib/supabaseClient");
const url = require("url");


// Number of products to fetch per page
const PAGE_SIZE = 10;

async function fetchProductsByCategoryController(
  request,
  response,
  categorySlug
) {
  if (request.method === "OPTIONS") {
    handlePreflight(request, response);
  }
  applyCORS(request, response);

  // parse the url to get the query paramter of page information
  const parsedURL = url.parse(request.url, true);
  const page = parseInt(parsedURL.query.page) || 1; // Default to page 1 if not provided
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;



  // console.log("Slug Received:", categorySlug);
 

  // Now extract the category information by slug
  const { data: categoryData, error: categoryError } = await supabaseClient
    .from("category")
    .select("*")
    .eq("slug", categorySlug)
    .single();
  if (!categoryData) {
    response.statusCode = 400;
    return response.end(
      JSON.stringify({
        error: "There is no data fetched from the backend",
        message: "Sorry,try again",
      })
    );
  }
  if (categoryError) {
    response.statusCode = 400;
    return response.end(
      JSON.stringify({
        error: categoryError,
        message: "Category Not Found",
      })
    );
  }

  const catgoryID = categoryData.id;

  // Now fetch the product information from products table using the categoryID
  const { data: productsData,count, error: productsError } = await supabaseClient
    .from("products")
    .select("*", {
      count: "exact", // Get the total count of products
    })
    .eq("product_category_id", catgoryID)
    .range(from, to)
    .order("created_at", { ascending: false });

  if (productsError) {
    response.statusCode = 500;
    return response.end(JSON.stringify({ error: "Failed to fetch products" }));
  }
  // console.log(count);
  const totalPages = Math.ceil(count / PAGE_SIZE);
  

  // return the reposne with the products information
  response.statusCode = 200;
  return response.end(
    JSON.stringify({
      currentPage: page,
      totalPages,
      totalItems: count,
      products: productsData,
      message: `All the product data of the ${categoryData.category_name} is fetched`,
    })
  );
}
module.exports = fetchProductsByCategoryController;
