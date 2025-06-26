const formidable = require("formidable");
const cloudinaryClient = require("../lib/cloudinaryClient");
const supabaseClient = require("../lib/supabaseClient");

function uploadCategoryInformationController(request, response) {
  // solving the CORS issue
  const allowedOrigin = [
    "http://localhost:3000",
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
  // creating a new formidable form instance
  const form = new formidable.IncomingForm({
    multiples: false,
  });
  // parsing the incoming form data

  form.parse(request, async (error, fields, files) => {
    // handling the error
    if (error) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "Error parsing the data",
          message: error,
        })
      );
    }
    // checking if the necessary information are present
    if (
      !fields.categoryName ||
      !fields.categoryDescription ||
      !files.categoryImage
    ) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({
          error: "Missing required fields",
          message: "Please provide all the fields",
        })
      );
    }

    const imageFile = files.categoryImage[0];
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

    try {
      // now upload the image in the cloudinary
      const result = await cloudinaryClient.uploader.upload(
        imageFile.filepath,
        {
          folder: "categoryImages",
        }
      );
      // get the secure URL of the uploaded image from cloudinary
      const imageURL = result.secure_url;
      console.log("Image uploaded to Cloudinary:", imageURL);
      // preparing the category information
      const categoryInformation = {
        name: fields.categoryName[0],
        description: fields.categoryDescription[0],
        imageURL: imageURL,
      };
      // now upload the category information to the database
      const { data, error: dbError } = await supabaseClient
        .from("category")
        .insert([
          {
            category_name: categoryInformation.name,
            category_description: categoryInformation.description,
            category_image: categoryInformation.imageURL,
          },
        ]).select();

      if (dbError) {
        console.log(
          "Error uploading category information to Supabase:",
          dbError
        );
        response.statusCode = 500;
        return response.end(
          JSON.stringify({
            error: "Database Error",
            message: dbError.message,
          })
        );
      }
      response.statusCode = 200;
      response.end(
        JSON.stringify({
          message: "Category information uploaded successfully",
          categoryInformation: data // return the category information
        })
      );

        // ===================================== Expected JSON format ========================================

      //   {
      //     "message": "Category information uploaded successfully",
      //     "categoryInformation": [
      //         {
      //             "id": 7,
      //             "created_at": "2025-06-26T13:16:11.671704+00:00",
      //             "category_name": "Trouser",
      //             "category_description": "Lorem ipsum dolor sit amet.",
      //             "category_image": "https://res.cloudinary.com/ddukqnbjm/image/upload/v1750943770/categoryImages/np8pep2u9ba3xj6d8hrr.jpg"
      //         }
      //     ]
      // }









    } catch (error) {
      console.log("Error uploading image to Cloudinary:", error);
      response.statusCode = 500;
      return response.end(
        JSON.stringify({
          error: "Error uploading image to Cloudinary",
          message: error,
        })
      );
    }
  });
}
module.exports = uploadCategoryInformationController;
