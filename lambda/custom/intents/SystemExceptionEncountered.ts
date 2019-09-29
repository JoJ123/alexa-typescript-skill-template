import { RequestHandler } from "ask-sdk-core";
import { RequestTypes } from "../lib/constants";
import { IsType } from "../lib/helpers";

export const SystemExceptionEncountered: RequestHandler = {
  canHandle(handlerInput) {
    return IsType(handlerInput, RequestTypes.SystemExceptionEncountered);
  },
  handle(handlerInput) {
    // tslint:disable-next-line
    console.log("\n******************* EXCEPTION **********************");
    // tslint:disable-next-line
    console.log("\n" + JSON.stringify(handlerInput.requestEnvelope, null, 2));

    return handlerInput.responseBuilder
      .getResponse();
  },
};
