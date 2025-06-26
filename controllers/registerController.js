const parseJSONBody = require("../utils/parseJSONBody");
const validateRegisterData = require("../validators/validateRegister");
const bcrypt = require("bcryptjs");
const supabaseClient = require("../lib/supabaseClient");


async function registerController(req, res) {
  const body = await parseJSONBody(req);
  const validationError = validateRegisterData(body);

  if (validationError.length > 0) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({ error: "Validation Error", messages: validationError })
    );
    return;
  }

  const { username, email, password } = body;

  // Fallback to DB if not in Redis
  const { data: existing, error: dbError } = await supabaseClient
    .from("users")
    .select("*")
    .or(`email.eq.${email},username.eq.${username}`);

  if (dbError) {
    console.error("Database error:", dbError);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: dbError.message }));
    return;
  }

  if (existing.length > 0) {
    const reasons = [];
    if (existing.some((u) => u.email === email))
      reasons.push("Email already exists");
    if (existing.some((u) => u.username === username))
      reasons.push("Username already exists");
    res.statusCode = 409;
    res.end(JSON.stringify({ error: "Conflict", reasons }));
    return;
  }

  // All good → Hash password and insert
  const hashPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabaseClient.from("users").insert([
    {
      username,
      email,
      password_hash: hashPassword,
    },
  ]);

  if (error) {
    console.error("Insert error:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message }));
    return;
  }
 

  res.statusCode = 200;
  res.end(
    JSON.stringify({ message: "User registered successfully", data: data })
  );
}

module.exports = registerController;
