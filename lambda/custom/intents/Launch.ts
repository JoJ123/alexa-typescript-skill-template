import { RequestHandler } from "ask-sdk-core";
import { RequestTypes, Strings } from "../lib/constants";
import { GetRequestAttributes, IsType } from "../lib/helpers";

export const Launch: RequestHandler = {
  canHandle(handlerInput) {
    return IsType(handlerInput, RequestTypes.Launch);
  },
  handle(handlerInput) {
    const { t } = GetRequestAttributes(handlerInput);

    const speechText = t(Strings.WELCOME_MSG);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};
