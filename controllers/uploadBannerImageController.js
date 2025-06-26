// formidable module to debug the multipart/formdata
const formidable = require("formidable");
const cloudinaryClient = require("../lib/cloudinaryClient");
const supabaseClient = require("../lib/supabaseClient");

function uploadBannerImageController(req, res) {
  // solving the CORS issue
  const allowedOrigin = ["http://localhost:3000", "http://localhost:3001","https://on-bajar-front-end.vercel.app","https://on-bazar-admin-panel-front-end-rqqu.vercel.app"]; // Add your allowed origins here
  const origin = req.headers.origin;
  if(allowedOrigin.includes(origin)) 
  {
    res.setHeader("Access-Control-Allow-Origin", origin); // Set the allowed origin
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204); // No Content
    res.end();
    return;
  }
  // creating a new formidable form instance
  const form = new formidable.IncomingForm({
    multiples: false, // to allow only single file uploads
  });

  // pasrsing the incoming image stream(which comes as a binary stream)
  form.parse(req, async (error, fields, files) => {
    // handling the error
    if (error) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({
          error: "Error parsing form data",
          message: error,
        })
      );
    }
    // checking if the file is present in the files object
    if (!files.bannerImage) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({
          error: "file has not reached the backend",
          message: "Please upload a file with the key 'bannerImage'",
        })
      );
    }

    const imageFile = files.bannerImage[0];
    console.log("Image file received:", files.bannerImage[0]);
    // chekcing if the file has the proper type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      res.end(
        JSON.stringify({
          error: "Invalid file type",
          message: "Please upload a valid image file (jpg, jpeg, png)",
        })
      );
    }

    // now upload the image in the cloudinary
    try {
      // Upload the image to Cloudinary
      const result = await cloudinaryClient.uploader.upload(
        imageFile.filepath,
        {
          folder: "banner_images", // specify the folder in cloudinary
        }
      );

      const imageURL = result.secure_url; // get the secure URL of the uploaded image
      console.log("Image uploaded to Cloudinary:", imageURL);

      // now upload the imageURL to the supabase
      const { data, error: dberror } = await supabaseClient
        .from("bannerImages")
        .insert([{ imageURL: imageURL }]);
      if (dberror) {
        console.error("Error uploading image URL to Supabase:", dberror);
        res.statusCode = 500;
        return res.end(
          JSON.stringify({
            error: "Database Error",
            message: dberror.message,
          })
        );
      }

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          message: "Image uploaded successfully",
          imageURL: imageURL, // return the image URL
        })
      );
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  });
}
module.exports = uploadBannerImageController;
