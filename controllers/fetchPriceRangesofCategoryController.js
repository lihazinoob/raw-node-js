const supabaseClient = require("../lib/supabaseClient");
const { applyCORS, handlePreflight } = require("../utils/corsHelper");

async function fetchPriceRangesofCategoryController(request, response, slug) {
  if (request.method === "OPTIONS") {
    handlePreflight(request, response);
  }
  applyCORS(request, response);
  const { data: category, error: categoryError } = await supabaseClient
    .from("category")
    .select("*")
    .eq("slug", slug)
    .single();

  if (categoryError || !category) {
    response.statusCode = 400;
    return response.end(JSON.stringify({ error: "Invalid category slug" }));
  }
  // Fetch the price ranges for the category
  const { data: products, error: productsError } = await supabaseClient
    .from("products")
    .select("product_price")
    .eq("product_category_id", category.id);

  if (productsError) {
    response.statusCode = 500;
    return response.end(
      JSON.stringify({ error: "Error fetching product prices" })
    );
  }

  const prices = products.map((p) => p.product_price);
  // Send prices, you'll compute ranges on frontend
  response.statusCode = 200;
  return response.end(JSON.stringify({ prices }));
}

module.exports = fetchPriceRangesofCategoryController;
