// doing this we don't need all try catch blocks
// 1. function takes in all arguments req, res, next
// 2. resolve Promise > calls next

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
