/* JSON Success Response */
const successMessage = (
  res,
  message,
  name,
  data,
  name2,
  data2,
  name3,
  data3,
  name4,
  data4
) => {
  if (!name || !data) {
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: {
        result: message,
      },
    });
  } else {
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: {
        result: message,
        [name]: data,
        [name2]: data2,
        [name3]: data3,
        [name4]: data4,
      },
    });
  }
};

module.exports = successMessage;
