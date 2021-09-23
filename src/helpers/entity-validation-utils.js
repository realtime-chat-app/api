function isOfType(value, type) {
  if (typeof value !== type) return false;
  return true;
}

function isArray(value) {
  if (!value.length || typeof value !== "object") return false;
  return true;
}

function isBiggerThan(value, size) {
  if (value.length > size) return true;
  return false;
}

function isBiggerOrEqualThan(value, size) {
  if (value.length >= size) return true;
  return false;
}

function isSmallerThan(value, size) {
  if (value.length < size) return true;
  return false;
}

function isSmallerOrEqualThan(value, size) {
  if (value.length <= size) return true;
  return false;
}

function arrayEntriesAreOfType(array, type) {
  return array.every((m) => typeof m === type);
}

module.exports = {
  isOfType,
  isArray,
  isBiggerThan,
  isBiggerOrEqualThan,
  isSmallerThan,
  isSmallerOrEqualThan,
  arrayEntriesAreOfType,
};
