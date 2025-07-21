const { applyCORS, handlePreflight } = require("../utils/corsHelper");
const supabaseClient = require("../lib/supabaseClient");
const formidable = require("formidable");
const cloudinaryClient = require("../lib/cloudinaryClient");


function updateProductInformationController(request,response,productId) {


  

  applyCORS(request, response);
  if (request.method === "OPTIONS") {
    handlePreflight(request, response);
    return;
  }
  

  

  if (isNaN(productId) || productId <= 0) {
    response.statusCode = 400;
    return response.end(
      JSON.stringify({
        error: "Invalid product ID",
        message: "Product ID must be a positive number",
      })
    );
  }

  // Parse the form data
  const form = new formidable.IncomingForm({
    multiples:true
  });

  form.parse(request,async(error,fields,files) =>{
    if(error) {
      response.statusCode = 500;
      return response.end(
        JSON.stringify({
          error: "Error parsing form data",
          message: error.message,
        })
      );
    }

    // Gather images: keep existing + upload new ones
    let imageURLs  = [];
    // Existing image URLs from client
    if (fields.existingImageURLs) {
      try {
        imageURLs = JSON.parse(fields.existingImageURLs[0] || fields.existingImageURLs);
      } catch {
        imageURLs = [];
      }
    }
    // New uploaded images
    const imageFiles = files.productImages;
    let newImages = [];
    if (imageFiles) {
      newImages = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
    }

    // Only allow between 3-5 images total
    const totalImageCount = imageURLs.length + newImages.length;
    if (totalImageCount < 3 || totalImageCount > 5) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "Invalid image count",
          message: "Total product images after update must be between 3 and 5.",
        })
      );
    }

      // Validate new images
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    for (let file of newImages) {
      if (!allowedTypes.includes(file.mimetype)) {
        response.statusCode = 400;
        return response.end(
          JSON.stringify({
            error: "Invalid file type",
            message: "Images must be in JPG, JPEG, or PNG format.",
          })
        );
      }
    }

      // Upload new images to Cloudinary
    try {
      for (let file of newImages) {
        const result = await cloudinaryClient.uploader.upload(file.filepath, {
          folder: "productImages",
        });
        imageURLs.push(result.secure_url);
      }
    } catch (uploadError) {
      console.error("[Error] Image upload failed:", uploadError);
      response.statusCode = 500;
      return response.end(
        JSON.stringify({ error: "Image upload error", message: uploadError.message })
      );
    }

    // Parse all fields
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

    const updateData = {
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
    };

    try {
      const {data,error:dbError}  = await supabaseClient
        .from("products")
        .update(updateData)
        .eq("id",productId)
        .select();
      
      if(dbError) {
        response.statusCode = 500;
        return response.end(
          JSON.stringify({
            error:"Database Error",
            message:dbError.message
          })
        );
      }

      if (!data || data.length === 0) {
        response.statusCode = 404;
        return response.end(
          JSON.stringify({ error: "Product not found", message: `No product found with id ${productId}` })
        );
      }

      response.statusCode = 200;
      response.end(
        JSON.stringify({
          message: "Product updated successfully",
          product: data[0],
        })
      );


    } catch (error) {
      response.statusCode = 500;
      return response.end(
        JSON.stringify({ error: "Product update error", message: error.message })
      );
    }


    




  })



}
module.exports = updateProductInformationController;