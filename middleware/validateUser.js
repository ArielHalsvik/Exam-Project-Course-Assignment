/* Validates User Information */
function validateUser(
  firstName,
  lastName,
  userName,
  email,
  password,
  address,
  telephoneNumber,
  postRequest = true
) {
  let missingFields = [];

  if (!firstName) {
    missingFields.push("firstName");
  } else if (!/^[a-zA-Z\s-]+$/.test(firstName)) {
    throw new Error("Invalid first name, please only use letters.");
  }

  if (!lastName) {
    missingFields.push("lastName");
  } else if (!/^[a-zA-Z\s-]+$/.test(lastName)) {
    throw new Error("Invalid last name, please only use letters.");
  }

  if (postRequest) {
    if (!userName) {
      missingFields.push("userName");
    } else if (!/^[a-zA-Z0-9]+$/.test(userName)) {
      throw new Error("Invalid username, please only use letters and numbers.");
    }
  }

  if (!email) {
    missingFields.push("email");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email, please use the correct format.");
  }

  if (postRequest) {
    if (!password) {
      missingFields.push("password");
    } else if (!/^[a-zA-Z0-9@!?.,_=\-+&#*^%$\/]+$/.test(password)) {
      throw new Error(
        "Invalid password, please only user letters, numbers and special characters."
      );
    }
  }

  if (!address) {
    missingFields.push("address");
  } else if (!/^[a-zA-Z0-9\s-]+$/.test(address)) {
    throw new Error("Invalid address, please only use letters and numbers.");
  }

  if (!telephoneNumber) {
    missingFields.push("telephoneNumber");
  } else if (!/^[0-9]+$/.test(telephoneNumber)) {
    throw new Error("Invalid telephone number, please only use numbers.");
  }

  if (missingFields.length > 0) {
    throw new Error(`Missing fields: ${missingFields.join(", ")}`);
  }
}

module.exports = validateUser;
