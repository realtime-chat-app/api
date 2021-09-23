const {
  isArray,
  isOfType,
  isSmallerThan,
  isBiggerThan,
} = require("../../helpers/entity-validation-utils");

class CreateMessageRequest {
  constructor(props) {
    validateSenderId(props.senderId);
    validateChatId(props.chatId);
    validateText(props.text);
    validateType(props.type);
    validateLatitude(props.latitude);
    validateLongitude(props.longitude);
    validateQuote(props.quote);

    this.senderId = props.senderId;
    this.chatId = props.chatId;
    this.text = props.text;
    this.type = props.type;
    this.reply = props.reply ? props.reply : false;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.quote = props.quote;
  }
}

function validateSenderId(senderId) {
  if (!senderId) throwError("senderId is required");
  if (!isOfType(senderId, "string")) throwError("senderId must be a string");
}

function validateChatId(chatId) {
  if (!chatId) throwError("chatId is required");
  if (!isOfType(chatId, "string")) throwError("chatId must be a string");
}

function validateText(text) {
  if (!text) throwError("text is required");
  if (!isOfType(text, "string")) throwError("text must be a string");
  if (isSmallerThan(text, 1))
    throwError("text must have a minumum of 1 character");
  if (isBiggerThan(text, 2000))
    throwError("text must have a maximum of 2000 characters");
}

function validateType(type) {
  if (!type) throwError("type is required");
  if (!isOfType(type, "string")) throwError("type must be a string");
  if ("'text''file''map''quote'".includes(type))
    throwError("type must be either 'text' | 'file' | 'map' | 'quote'");
}

// TODO: add quote properties validation
function validateQuote(quote) {
  try {
    JSON.parse(quote);
  } catch (error) {
    return throwError("quote must be a JSON object");
  }
  if (!isOfType(quote, "object") || isArray(quote))
    throwError("quote must be a object");
}

function validateLatitude(latitude) {
  if (!latitude) throwError("latitude is required");
  if (!isOfType(latitude, "number"))
    throwError("latitude must be a number DECIMAL(10,6)");
}

function validateLongitude(longitude) {
  if (!longitude) throwError("longitude is required");
  if (!isOfType(longitude, "number"))
    throwError("longitude must be a number DECIMAL(10,6)");
}

function throwError(msg) {
  throw new Error(msg);
}

module.exports = CreateMessageRequest;
