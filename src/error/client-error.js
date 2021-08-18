module.exports = function (message) {
  return new Promise((res, rej) => rej(message));
};
