const { applyCORS, handlePreflight } = require("../utils/corsHelper");
const supabaseClient = require("../lib/supabaseClient");
const formidable = require("formidable");
const cloudinaryClient = require("../lib/cloudinaryClient");

function updateProductInformationController(request, response, productId) {
  if (request.method === "OPTIONS") return handlePreflight(request, response);
  applyCORS(request, response);

  if (isNaN(productId) || productId <= 0) {
    response.statusCode = 400;
    return response.end(
      JSON.stringify({
        error: "Invalid product ID",
        message: "Product ID must be a positive number",
      })
    );
  }

  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(request, async (err, fields, files) => {
    if (err) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({ error: "Form parse error", message: err.message })
      );
    }

    // 1️⃣ Parse productData JSON
    let productData;
    try {
      productData = JSON.parse(fields.productData[0]);
    } catch (e) {
      response.statusCode = 400;
      return response.end(JSON.stringify({ error: "Invalid productData JSON" }));
    }

    // 2️⃣ Parse existing images if provided
    let existingImages = [];
    try {
      if (fields.existingImages && fields.existingImages[0]) {
        existingImages = JSON.parse(fields.existingImages[0]);
      }
    } catch (e) {
      response.statusCode = 400;
      return response.end(JSON.stringify({ error: "Invalid existingImages JSON" }));
    }

    // 3️⃣ Enhanced Validation
    if (!productData.name || typeof productData.name !== "string") {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({ error: "name is required and must be a string" })
      );
    }
    if (!productData.description || typeof productData.description !== "string") {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "description is required and must be a string",
        })
      );
    }
    if (isNaN(parseFloat(productData.productPrice))) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "productPrice is required and must be a number",
        })
      );
    }
    if (!Array.isArray(productData.sizes)) {
      response.statusCode = 400;
      return response.end(JSON.stringify({ error: "sizes must be an array" }));
    }
    if (productData.colors && !Array.isArray(productData.colors)) {
      response.statusCode = 400;
      return response.end(JSON.stringify({ error: "colors must be an array" }));
    }

    // 4️⃣ Calculate total quantity (fix the typo)
    const totalQuantity = productData.sizes.reduce(
      (sum, s) => sum + parseInt(s.quantity || 0, 10),
      0
    );

    // 5️⃣ Handle image updates
    let finalImageURLs = [];
    
    // Add existing images that weren't deleted
    if (Array.isArray(existingImages)) {
      finalImageURLs = [...existingImages];
    }

    // 6️⃣ Upload new images to Cloudinary
    const imageFiles = Object.keys(files)
      .filter((key) => key.startsWith("image_"))
      .map((key) => files[key]);

    for (let file of imageFiles) {
      try {
        const fileObj = Array.isArray(file) ? file[0] : file;
        if (!fileObj || !fileObj.filepath) {
          throw new Error("File path is missing in uploaded file");
        }
        const result = await cloudinaryClient.uploader.upload(
          fileObj.filepath,
          {
            folder: "productImages",
          }
        );
        finalImageURLs.push(result.secure_url);
      } catch (uploadErr) {
        response.statusCode = 500;
        return response.end(
          JSON.stringify({
            error: "Image upload failed",
            message: uploadErr.message,
          })
        );
      }
    }

    // 7️⃣ Validate final image count
    if (finalImageURLs.length < 1) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({ 
          error: "At least 1 image required",
          message: "Product must have at least one image (existing or new)"
        })
      );
    }

    // 8️⃣ Map frontend data to schema fields
    const updateData = {
      product_name: productData.name,
      product_description: productData.description,
      product_price: parseFloat(productData.productPrice),
      product_sale_percentage: parseInt(productData.salesPercentage, 10) || 0,
      is_featured_product: !!productData.isFeatured,
      is_new_product: !!productData.isNew,
      product_quantity: totalQuantity,
      product_colors: productData.colors || [],
      product_category_id: parseInt(productData.categoryId, 10),
      is_sold_out: !!productData.isSoldOut,
      product_image: finalImageURLs, // Combined existing + new images
      product_size: productData.sizes,
    };

    // 9️⃣ Update in Supabase
    try {
      const { data, error } = await supabaseClient
        .from("products")
        .update(updateData)
        .eq("id", productId)
        .select();

      if (error) {
        response.statusCode = 500;
        return response.end(
          JSON.stringify({ error: "Database error", message: error.message })
        );
      }

      if (!data || data.length === 0) {
        response.statusCode = 404;
        return response.end(
          JSON.stringify({
            error: "Product not found",
            message: `No product found with id ${productId}`,
          })
        );
      }

      response.statusCode = 200;
      response.end(
        JSON.stringify({
          message: "Product updated successfully",
          product: data[0],
        })
      );
    } catch (databaseError) {
      response.statusCode = 500;
      return response.end(
        JSON.stringify({
          error: "Product update error",
          message: databaseError.message,
        })
      );
    }
  });
}

module.exports = updateProductInformationController;