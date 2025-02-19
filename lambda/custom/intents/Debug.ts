import { RequestHandler } from "ask-sdk-core";

export const Debug: RequestHandler = {
  canHandle(handlerInput) {
    // tslint:disable-next-line
    console.log(JSON.stringify(handlerInput, null, 2));

    return false;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .getResponse();
  },
};
