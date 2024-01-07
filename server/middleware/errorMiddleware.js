const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // if there is error with statusCode 200 return 500 otherwise return whatever statusCode was returned e.g 401
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  // Check for Mongoose bad ObjectId

  // if in development will get err.stack in json as well.
  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
