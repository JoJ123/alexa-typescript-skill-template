import { RequestHandler } from "ask-sdk-core";
import { IntentTypes, Strings } from "../../lib/constants";
import { GetRequestAttributes, IsIntent } from "../../lib/helpers";

export const HelloWorld: RequestHandler = {
  canHandle(handlerInput) {
    return IsIntent(handlerInput, IntentTypes.HelloWorld);
  },
  handle(handlerInput) {
    const { t } = GetRequestAttributes(handlerInput);

    const speechText = t(Strings.HELLO_MSG);

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};
