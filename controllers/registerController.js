const parseJSONBody = require("../utils/parseJSONBody");
const validateRegisterData = require("../validators/validateRegister");
const bcrypt = require("bcryptjs");
const supabaseClient = require("../lib/supabaseClient");

async function registerController(req, res) {
  // parsing the JSON body of the request
  const body = await parseJSONBody(req);
  // Validate the registration data
  const validationError = validateRegisterData(body);
  if (validationError.length > 0) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        error: "Validation Error",
        messages: validationError,
      })
    );
    return;
  }
  // destructuring the required data from the body
  const { username, email, password } = body;

  // Hash the password using bcrypt
  const hashPassword = await bcrypt.hash(password, 10);

  // Now I need to save the data to the database. Here I will be using supabase.
  const { data, error } = await supabaseClient.from("users").insert([
    {
      username: username,
      email: email,
      password_hash: hashPassword, // Storing the hashed password
    },
  ]);
  if (error) {
    console.error("Error inserting data into Supabase:", error);
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: error.message,
        message: "Failed to register user.",
      })
    );
    return;
  }

  res.statusCode = 200;
  res.end("Registration successful");
}
module.exports = registerController;
