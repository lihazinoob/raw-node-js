// function for parsing the JSON body of the incoming request

function parseJSONBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    // Listening for data events to collect the body. data comes in chunks
    request.on("data", (chunk) => {
      body = body + chunk.toString();
    });
    // Listening for end event to resolve the promise with the parsed JSON
    request.on("end", () => {
      try {
        const parsedData = JSON.parse(body);
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    });
  });
}
module.exports = parseJSONBody;