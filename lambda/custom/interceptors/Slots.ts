import { RequestInterceptor } from "ask-sdk-core";
import { RequestTypes } from "../lib/constants";
import { GetSlotValues } from "../lib/helpers";
import { RequestAttributes } from "../typings";

/**
 * Parses and adds the slot values to the RequestAttributes.
 */
export const Slots: RequestInterceptor = {
  process(handlerInput) {
    const attributes = handlerInput.attributesManager.getRequestAttributes() as RequestAttributes;

    if (handlerInput.requestEnvelope.request.type === RequestTypes.Intent) {
      attributes.slots = GetSlotValues(handlerInput.requestEnvelope.request.intent.slots);
    } else {
      attributes.slots = {};
    }
  },
};
