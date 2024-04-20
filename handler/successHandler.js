const headers = require('./../utils/header');

function handleSuccess(res, data) {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      data,
    })
  );
  res.end();
}

module.exports = handleSuccess;
