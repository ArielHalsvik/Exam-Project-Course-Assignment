var errorMessage = require("../middleware/errorMessage");

/* Validates Search Endpoint */
async function checkSearch(req, res, next) {
  let { name, category, brand } = req.body;

  try {
    if (!name && !category && !brand) {
      return errorMessage(
        res,
        "Please provide a search term: name, category and/or brand."
      );
    }

    next();
  } catch (error) {
    return errorMessage(res, "Could not validate search terms.");
  }
}

module.exports = checkSearch;
