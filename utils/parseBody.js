export const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parseData = JSON.parse(body);
        resolve(parseData);
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
};
