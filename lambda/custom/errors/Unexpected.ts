import { ErrorHandler } from "ask-sdk-core";
import { ErrorTypes, Strings } from "../lib/constants";
import { GetRequestAttributes } from "../lib/helpers";

/**
 * Handles ErrorTypes.Unexpected errors which should be thrown when something
 * unexpected happens.
 */
export const Unexpected: ErrorHandler = {
  canHandle(_, error) {
    return error.name === ErrorTypes.Unexpected;
  },
  handle(handlerInput, error) {
    // tslint:disable-next-line
    console.error(error);

    const { t } = GetRequestAttributes(handlerInput);

    return handlerInput.responseBuilder
      .speak(t(Strings.ERROR_UNEXPECTED_MSG))
      .getResponse();
  },
};
