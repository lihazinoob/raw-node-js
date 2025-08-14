const formidable = require("formidable");
const cloudinaryClient = require("../lib/cloudinaryClient");
const supabaseClient = require("../lib/supabaseClient");
const { applyCORS, handlePreflight } = require("../utils/corsHelper");

async function createProductController(req, res) {
  if (req.method === "OPTIONS") return handlePreflight(req, res);
  applyCORS(req, res);

  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({ error: "Form parse error", message: err.message })
      );
    }

    // 1️⃣ Parse productData JSON
    let productData;
    try {
      productData = JSON.parse(fields.productData[0]);
    } catch (e) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Invalid productData JSON" }));
    }

    // 2️⃣ Enhanced Validation
    if (!productData.name || typeof productData.name !== "string") {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({ error: "name is required and must be a string" })
      );
    }
    if (
      !productData.description ||
      typeof productData.description !== "string"
    ) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({
          error: "description is required and must be a string",
        })
      );
    }
    if (isNaN(parseFloat(productData.productPrice))) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({
          error: "productPrice is required and must be a number",
        })
      );
    }
    if (!Array.isArray(productData.sizes)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "sizes must be an array" }));
    }
    // Add more validations as needed (e.g., categoryId, salesPercentage)

    // 3️⃣ Calculate total quantity
    const totalQuantity = productData.sizes.reduce(
      (sum, s) => sum + parseInt(s.quantity || 0, 10),
      0
    );

    // 4️⃣ Extract all image files (image_0, image_1, ...)
    const imageFiles = Object.keys(files)
      .filter((key) => key.startsWith("image_"))
      .map((key) => files[key]);

    if (imageFiles.length < 1) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "At least 1 image required" }));
    }

    // 5️⃣ Upload images to Cloudinary with error handling
    const imageURLs = [];
    for (let file of imageFiles) {
      try {
        // Debug: Log the file object to inspect its structure
        console.log("File object:", file);
        // Handle case where file might be an array of PersistentFile objects
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
        imageURLs.push(result.secure_url);
      } catch (uploadErr) {
        res.statusCode = 500;
        return res.end(
          JSON.stringify({
            error: "Image upload failed",
            message: uploadErr.message,
          })
        );
      }
    }
    // 6️⃣ Map frontend data to schema fields
    const dbProduct = {
      product_name: productData.name,
      product_description: productData.description,
      product_price: parseFloat(productData.productPrice),
      product_sale_percentage: parseInt(productData.salesPercentage, 10) || 0, // Default to 0 if missing
      is_featured_product: !!productData.isFeatured, // Ensure boolean
      is_new_product: !!productData.isNew,
      product_quantity: totalQuantity,
      product_colors: productData.colors || [], // Empty array since not provided; adjust if frontend adds colors
      product_category_id: parseInt(productData.categoryId, 10),
      is_sold_out: !!productData.isSoldOut,
      product_image: imageURLs, // Array of URLs
      product_size: productData.sizes, // JSONB handles array of objects
      // Ignore calculatedPriceAfterDiscount and totalProducts
    };

    // 7️⃣ Insert into Supabase
    const { data, error } = await supabaseClient
      .from("products")
      .insert([dbProduct])
      .select();

    if (error) {
      res.statusCode = 500;
      return res.end(
        JSON.stringify({ error: "Database error", message: error.message })
      );
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "Product created successfully",
        product: data[0],
      })
    );
  });
}

module.exports = createProductController;
