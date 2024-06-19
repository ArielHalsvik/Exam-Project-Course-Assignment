/* Validates Product Information */
function validateProduct(
  name,
  description,
  imgUrl,
  unitPrice,
  quantity,
  categoryId,
  brandId,
  isDeleted,
  checkIsDeleted = false
) {
  let missingFields = [];

  if (!name) {
    missingFields.push("name");
  } else if (!/^[a-zA-Z0-9\s@!?.,_~:';()*=\-+&#%$\/]+$/.test(name)) {
    throw new Error(
      "Invalid name, please only use letters, numbers, spaces and typical special characters."
    );
  }

  if (!description) {
    missingFields.push("description");
  } else if (!/^[a-zA-Z0-9\s@!?.,_~:';()*=\-+&#%$\/]+$/.test(description)) {
    throw new Error(
      "Invalid description, please only use letters, numbers, spaces and typical special characters."
    );
  }

  if (!imgUrl) {
    missingFields.push("imgUrl");
  } else if (
    !/^(https?:\/\/[a-zA-Z0-9@!?.,_~:';()*=\-+&#%$\/]+)$/.test(imgUrl)
  ) {
    throw new Error("Invalid imgUrl, please use a valid URL.");
  }

  if (!unitPrice) {
    missingFields.push("unitPrice");
  } else if (!/^[0-9.]+$/.test(unitPrice)) {
    throw new Error("Invalid unitPrice, please only use numbers.");
  }

  if (!quantity) {
    missingFields.push("quantity");
  } else if (!/^[0-9]+$/.test(quantity)) {
    throw new Error("Invalid quantity, please only use numbers.");
  }

  if (!categoryId) {
    missingFields.push("categoryId");
  } else if (!/^[0-9]+$/.test(categoryId)) {
    throw new Error("Invalid categoryId, please only use numbers.");
  }

  if (!brandId) {
    missingFields.push("brandId");
  } else if (!/^[0-9]+$/.test(brandId)) {
    throw new Error("Invalid brandId, please only use numbers.");
  }

  if (checkIsDeleted) {
    if (isDeleted === undefined) {
      missingFields.push("isDeleted");
    } else if (isNaN(isDeleted) || (isDeleted !== 0 && isDeleted !== 1)) {
      throw new Error("Invalid isDeleted, please only use 1 or 0.");
    }
  }

  if (missingFields.length > 0) {
    throw new Error(`Missing fields: ${missingFields.join(", ")}`);
  }
}

module.exports = validateProduct;
