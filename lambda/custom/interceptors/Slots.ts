import { RequestInterceptor } from "ask-sdk-core";
import { RequestTypes } from "../lib/constants";
import { GetSlotValues } from "../lib/helpers";
import { IRequestAttributes } from "../typings";

/**
 * Parses and adds the slot values to the IRequestAttributes.
 */
export const Slots: RequestInterceptor = {
  process(handlerInput) {
    const attributes = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes;

    if (handlerInput.requestEnvelope.request.type === RequestTypes.Intent) {
      attributes.slots = GetSlotValues(handlerInput.requestEnvelope.request.intent.slots);
    } else {
      attributes.slots = {};
    }
  },
};
