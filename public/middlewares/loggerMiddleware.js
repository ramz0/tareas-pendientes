module.exports = (req, res, next) => {
  const { originalUrl, method } = req;
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);
  next();
};