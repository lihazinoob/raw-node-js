const { applyCORS, handlePreflight } = require("../utils/corsHelper");
const formidable = require("formidable");
const cloudinaryClient = require("../lib/cloudinaryClient");
const supabaseClient = require("../lib/supabaseClient");
function createProductController(request, response) {
  if (request.method === "OPTIONS") {
    handlePreflight(request, response);
  }
  applyCORS(request, response);

  // creating a new formidable form instance
  const form = new formidable.IncomingForm({
    multiples: false,
  });

  // parsing the incoming form data
  form.parse(request, async (error, fields, files) => {
    // error hadnling when there is an issue parsing the data
    if (error) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "Error parsing the data",
          message: error,
        })
      );
    }

    const imageFile = files.productImage[0];
    // checking if the image file is present in the files parameter
    if (!files.productImage[0]) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "Missing the product image file",
          message: "Please provide the product image",
        })
      );
    }

    // checking if the file has the proper type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "Invalid file type",
          message: "Please upload a valid image file (jpg, jpeg, png)",
        })
      );
    }

    // checking if the necessary information are present
    if (
      !fields.productName ||
      !fields.productDescription ||
      !fields.productPrice ||
      !fields.productQuantity ||
      !fields.productColors ||
      !fields.productCategoryId
    ) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "Missing required fields",
          message:
            "Make sure to include product name, description, price, quantity, colors, category, and image.",
        })
      );
    }

    // destructuring the fields
    const {
      productName,
      productDescription,
      productPrice,
      productSalePercentage,
      isFeaturedProduct,
      isProductNew,
      productQuantity,
      productColors,
      productCategoryId,
      isSoldOut,
    } = fields;

    try {
      // Upload the image to Cloudinary
      const cloudinaryResult = await cloudinaryClient.uploader.upload(
        imageFile.filepath,
        {
          folder: "productImages",
        }
      );
      // Get the secure URL of the uploaded image
      const imageURL = cloudinaryResult.secure_url;

      // parse the incoming data to convert to usable forms
      const parsedPrice = parseFloat(productPrice);
      const parsedQuantity = parseInt(productQuantity);
      const parsedColors = JSON.parse(productColors);
      const parsedCategoryId = JSON.parse(productCategoryId);
      const parsedSalePercentage = productSalePercentage
        ? parseInt(productSalePercentage)
        : null;
      const featured = isFeaturedProduct === "true";
      const newProduct = isProductNew === "true";
      const soldOut = isSoldOut === "true";

      // Insert into supabase
      const { data, error } = await supabaseClient
        .from("products")
        .insert([
          {
            product_name: productName,
            product_description: productDescription,
            product_price: parsedPrice,
            product_sale_percentage: parsedSalePercentage,
            is_featured_product: featured,
            is_new_product: newProduct,
            product_quantity: parsedQuantity,
            product_colors: parsedColors,
            product_category_id: parsedCategoryId,
            is_sold_out: soldOut,
            product_image: imageURL,
          },
        ])
        .select();
      if (error) {
        console.error("Error inserting product into Supabase:", error);
        response.statusCode = 500;
        return response.end(
          JSON.stringify({
            error: "Database Error",
            message: error.message,
          })
        );
      }
      // Respond with success
      response.statusCode = 200;
      response.end(
        JSON.stringify({
          message: "Product created successfully",
          product: data[0], // return the created product
        })
      );
    } catch (error) {
      console.error("Error uploading product image:", error);
      response.statusCode = 500;
      return response.end(
        JSON.stringify({
          error: "Image Upload Error",
          message: error.message,
        })
      );
    }
  });
}
module.exports = createProductController;
