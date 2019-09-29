import { RequestHandler } from "ask-sdk-core";
import { IntentTypes, Strings } from "../lib/constants";
import { GetRequestAttributes, IsIntent } from "../lib/helpers";

export const Fallback: RequestHandler = {
  canHandle(handlerInput) {
    return IsIntent(handlerInput, IntentTypes.AmazonFallback);
  },
  handle(handlerInput) {
    const { t } = GetRequestAttributes(handlerInput);

    const speechText = t(Strings.FALLBACK_MSG);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(t(Strings.FALLBACK_REPROMPT))
      .getResponse();
  },
};
