/* JSON Error Response */
const errorMessage = (res, message) => {
  return res.status(500).json({
    status: "error",
    statusCode: 500,
    data: {
      result: message,
    },
  });
};

module.exports = errorMessage;
