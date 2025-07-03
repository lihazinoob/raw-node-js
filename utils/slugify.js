// This function creates a slug for pretty urls mapping 
// the given string to a URL-friendly format.
function slugify(text)
{
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
// Export the slugify function for use in other modules
module.exports = slugify;