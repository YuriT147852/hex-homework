const headers = require('./../utils/header');

function handleError(res, error) {
  res.writeHead(400, headers);
  let message = '';
  if (error) {
    message = error.message;
  } else {
    message = '欄位未填寫正確或無此 id';
  }
  res.write(
    JSON.stringify({
      status: 'failed',
      message,
    })
  );
  res.end();
}

module.exports = handleError;
