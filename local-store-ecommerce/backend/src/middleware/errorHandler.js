function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong on the server" });
}

module.exports = { notFoundHandler, errorHandler };
