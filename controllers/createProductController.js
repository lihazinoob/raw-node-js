// Updated controller to support 3–5 image uploads with debugging logs
const { applyCORS, handlePreflight } = require("../utils/corsHelper");
const formidable = require("formidable");
const cloudinaryClient = require("../lib/cloudinaryClient");
const supabaseClient = require("../lib/supabaseClient");

function createProductController(request, response) {
  if (request.method === "OPTIONS") {
    return handlePreflight(request, response);
  }

  applyCORS(request, response);

  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(request, async (error, fields, files) => {
    if (error) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({ error: "Form parse error", message: error.message })
      );
    }

    const imageFiles = files.productImages;

    if (
      !imageFiles ||
      !Array.isArray(imageFiles) ||
      imageFiles.length < 3 ||
      imageFiles.length > 5
    ) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "Invalid image count",
          message: "You must upload between 3 and 5 product images.",
        })
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    for (let file of imageFiles) {
      if (!allowedTypes.includes(file.mimetype)) {
        // console.warn("[Validation] Invalid file type detected:", file.mimetype);
        response.statusCode = 400;
        return response.end(
          JSON.stringify({
            error: "Invalid file type",
            message: "Images must be in JPG, JPEG, or PNG format.",
          })
        );
      }
    }

    try {
      // console.log("[Controller] Uploading images to Cloudinary...");
      const imageURLs = [];
      for (let file of imageFiles) {
        const result = await cloudinaryClient.uploader.upload(file.filepath, {
          folder: "productImages",
        });
        imageURLs.push(result.secure_url);
      }
      // console.log("[Controller] Uploaded image URLs:", imageURLs);

      const {
        productName,
        productDescription,
        price,
        salesPercent,
        isFeatured,
        isNew,
        isSoldOut,
        quantity,
        colors,
        sizes,
        categoryId,
      } = fields;
      console.log("The fields received:", fields);

      const parsedPrice = parseFloat(price[0]);
      const parsedQuantity = parseInt(quantity[0]);
      const parsedColors = JSON.parse(colors[0]);
      const parsedSizes = JSON.parse(sizes[0]);
      const parsedCategoryId = JSON.parse(categoryId[0]);
      const parsedSalePercentage =
        salesPercent && salesPercent[0].trim() !== ""
          ? parseInt(salesPercent[0])
          : 0;

      const featured = isFeatured[0] === "true";
      const newProduct = isNew[0] === "true";
      const soldOut = isSoldOut[0] === "true";

      console.log("Data being inserted into DB:", {
        product_name: productName[0],
        product_description: productDescription[0],
        product_price: parsedPrice,
        product_sale_percentage: parsedSalePercentage,
        is_featured_product: featured,
        is_new_product: newProduct,
        product_quantity: parsedQuantity,
        product_colors: parsedColors,
        product_size: parsedSizes,
        product_category_id: parsedCategoryId,
        is_sold_out: soldOut,
        product_image: imageURLs,
      });

      const { data, error: dbError } = await supabaseClient
        .from("products")
        .insert([
          {
            product_name: productName[0],
            product_description: productDescription[0],
            product_price: parsedPrice,
            product_sale_percentage: parsedSalePercentage,
            is_featured_product: featured,
            is_new_product: newProduct,
            product_quantity: parsedQuantity,
            product_colors: parsedColors,
            product_size: parsedSizes,
            product_category_id: parsedCategoryId,
            is_sold_out: soldOut,
            product_image: imageURLs,
          },
        ])
        .select();

      if (dbError) {
        response.statusCode = 500;
        return response.end(
          JSON.stringify({ error: "Database error", message: dbError.message })
        );
      }

      response.statusCode = 200;
      response.end(
        JSON.stringify({
          message: "Product created successfully",
          product: data[0],
        })
      );
    } catch (uploadError) {
      console.error("[Error] Upload or insertion failed:", uploadError);
      response.statusCode = 500;
      return response.end(
        JSON.stringify({ error: "Upload error", message: uploadError.message })
      );
    }
  });
}

module.exports = createProductController;
