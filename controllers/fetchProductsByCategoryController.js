const { applyCORS, handlePreflight } = require("../utils/corsHelper");
const supabaseClient = require("../lib/supabaseClient");
async function fetchProductsByCategoryController(
  request,
  response,
  categorySlug
) {
  if (request.method === "OPTIONS") {
    handlePreflight(request, response);
  }
  applyCORS(request, response);

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
  const { data: productsData, error: productsError } = await supabaseClient
    .from("products")
    .select("*")
    .eq("product_category_id", catgoryID);

  if (productsError) {
    response.statusCode = 500;
    return response.end(JSON.stringify({ error: "Failed to fetch products" }));
  }

  // return the reposne with the products information
  response.statusCode = 200;
  return response.end(
    JSON.stringify({
      products: productsData,
      message: `All the product data of the ${categoryData.category_name} is fetched`,
    })
  );
}
module.exports = fetchProductsByCategoryController;
