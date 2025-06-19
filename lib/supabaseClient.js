const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// This file is used to create a Supabase client instance that can be used throughout the application.
// It reads the Supabase project URL and key from environment variables.

const supabaseURL = process.env.SUPABASE_URL;

const supabaseKey = process.env.SUPABASE_KEY;
const supabaseClient =  createClient(supabaseURL,supabaseKey);
module.exports = supabaseClient;
