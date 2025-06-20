// formidable module to debug the multipart/formdata
const formidable = require("formidable");

function uploadBannerImageController(req,res)
{
  // creating a new formidable form instance
  const form = new formidable.IncomingForm({
    multiples:false, // to allow only single file uploads
  });

  // pasrsing the incoming image stream(which comes as a binary stream)
  form.parse(req,async(error,fields,files)=>{
    // handling the error
    if(error)
    {
      res.statusCode = 400;
      return res.end(JSON.stringify({
        error:"Error parsing form data",
        message:error
      }))
    }
    console.log("Files received:", files);
    console.log("Fields received:", fields);
  })
  
}
module.exports = uploadBannerImageController;