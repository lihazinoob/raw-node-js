function validateRegisterData({ username, email, password, confirmPassword }) {
  // console.log(username,email,password,confirmPassword);
  // declaring an array to hold error messages
  const errors = [];
  // if no required fields are provided then throw an error
  if (!username || !email || !password || !confirmPassword) {
    errors.push("All fields are required.");
    return errors;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Invalid email format.");
    return errors;
  }
  const strongPasswordRegex = /^(?=.*[A-Z]).{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    errors.push(
      "Password must be at least 8 characters and contain a capital letter."
    );
    return errors;
  }

  if (password !== confirmPassword) {
    errors.push("Passwords do not match.");
    return errors;
  }

  return errors;
}
module.exports = validateRegisterData;
