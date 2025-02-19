import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, services } from "ask-sdk-model";
import { IRequestAttributes, ISessionAttributes, ISlots, ISlotValues } from "../typings";
import { ErrorTypes, RequestTypes } from "./constants";

/**
 * Checks if the request matches any of the given intents.
 *
 * @param handlerInput
 * @param intents
 */
export function IsIntent(handlerInput: HandlerInput, ...intents: string[]): boolean {
  if (handlerInput.requestEnvelope.request.type === RequestTypes.Intent) {
    for (const intent of intents) {
      if (handlerInput.requestEnvelope.request.intent.name === intent) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if the request matches any of the given types.
 *
 * @param handlerInput
 * @param types
 */
export function IsType(handlerInput: HandlerInput, ...types: string[]): boolean {
  for (const type of types) {
    if (handlerInput.requestEnvelope.request.type === type) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if the request matches the given intent and dialogState.
 *
 * @param handlerInput
 * @param intent
 * @param state
 */
export function IsIntentWithDialogState(handlerInput: HandlerInput, intent: string, state: string): boolean {
  return handlerInput.requestEnvelope.request.type === RequestTypes.Intent
    && handlerInput.requestEnvelope.request.intent.name === intent
    && handlerInput.requestEnvelope.request.dialogState === state;
}

/**
 * Checks if the request matches the given intent with a non COMPLETED dialogState.
 *
 * @param handlerInput
 * @param intent
 */
export function IsIntentWithIncompleteDialog(handlerInput: HandlerInput, intent: string): boolean {
  return handlerInput.requestEnvelope.request.type === RequestTypes.Intent
    && handlerInput.requestEnvelope.request.intent.name === intent
    && handlerInput.requestEnvelope.request.dialogState !== "COMPLETED";
}

/**
 * Checks if the request matches the given intent with the COMPLETED dialogState.
 *
 * @param handlerInput
 * @param intent
 */
export function IsIntentWithCompleteDialog(handlerInput: HandlerInput, intent: string): boolean {
  return IsIntentWithDialogState(handlerInput, intent, "COMPLETED");
}

/**
 * Gets the request attributes and casts it to our custom IRequestAttributes type.
 *
 * @param handlerInput
 */
export function GetRequestAttributes(handlerInput: HandlerInput): IRequestAttributes {
  return handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes;
}

/**
 * Gets the session attributes and casts it to our custom ISessionAttributes type.
 *
 * @param handlerInput
 */
export function GetSessionAttributes(handlerInput: HandlerInput): ISessionAttributes {
  return handlerInput.attributesManager.getSessionAttributes() as ISessionAttributes;
}

/**
 * Gets the directive service client.
 *
 * @param handlerInput
 */
export function GetDirectiveServiceClient(handlerInput: HandlerInput): services.directive.DirectiveServiceClient {
  return handlerInput.serviceClientFactory!.getDirectiveServiceClient();
}

/**
 * Resets the given slot value by setting it to an empty string.
 * If the intent is using the Dialog Directive, this will cause Alexa
 * to reprompt the user for that slot.
 *
 * @param request
 * @param slotName
 */
export function ResetSlotValue(request: IntentRequest, slotName: string) {
  if (request.intent.slots) {
    const slot = request.intent.slots[slotName];
    if (slot) {
      slot.value = "";
    }
  }
}

/**
 * Resets all unmatched slot values by setting them to an empty string.
 * If the intent is using the Dialog Directive, this will cause Alexa
 * to reprompt the user for those slots.
 *
 * @param request
 */
export function ResetUnmatchedSlotValues(handlerInput: HandlerInput, slots: ISlotValues) {
  if (handlerInput.requestEnvelope.request.type === RequestTypes.Intent) {
    const request = handlerInput.requestEnvelope.request;

    // reset invalid slots
    Object.keys(slots).forEach((key) => {
      const slot = slots[key];

      if (slot && !slot.isMatch) {
        ResetSlotValue(request, slot.name);
      }
    });
  }
}

/**
 * Parses the slot values and returns a new object with additional information,
 * e.g. if the value was matched, or if it is ambiguous etc.
 *
 * Example:
 *   If we have the following Drink Slot Type:
 *   {
 *     "types": [{
 *       "values": [{
 *           "id": "cocacola",
 *           "name": {
 *             "value": "Coca Cola"
 *           }
 *         },
 *         {
 *           "id": "cocacolazero",
 *           "name": {
 *             "value": "Coca Cola Zero"
 *           }
 *         }
 *       ]
 *     }]
 *   }
 *
 *   If the user said "Cola", the following value should be generated:
 *   {
 *     "name": "drink", // slot name
 *     "value": "Cola", // what the user said
 *     "isMatch": true, // was successfuly matched with our slot type
 *     "resolved": "Coca Cola", // the first resolved value
 *     "id": "cocacola", // the first resolved id
 *     "isAmbiguous": true, // true because we matched multiple possible values
 *     "values": [{
 *         "name": "Coca Cola",
 *         "id": "cocacola"
 *       },
 *       {
 *         "name": "Coca Cola Zero",
 *         "id": "cocacolazero"
 *       }
 *     ],
 *     "confirmationStatus": "NONE"
 *   }
 *
 * @param filledSlots
 */
export function GetSlotValues(filledSlots?: ISlots): ISlotValues {
  const slotValues: ISlotValues = {};

  if (filledSlots) {
    Object.keys(filledSlots).forEach((item) => {
      const name = filledSlots[item].name;
      const value = filledSlots[item].value;
      const confirmationStatus = filledSlots[item].confirmationStatus;

      if (filledSlots[item] &&
        filledSlots[item].resolutions &&
        filledSlots[item].resolutions!.resolutionsPerAuthority &&
        filledSlots[item].resolutions!.resolutionsPerAuthority![0] &&
        filledSlots[item].resolutions!.resolutionsPerAuthority![0].status &&
        filledSlots[item].resolutions!.resolutionsPerAuthority![0].status.code) {
        switch (filledSlots[item].resolutions!.resolutionsPerAuthority![0].status.code) {
          case "ER_SUCCESS_MATCH":
            const valueWrappers = filledSlots[item].resolutions!.resolutionsPerAuthority![0].values;

            if (valueWrappers.length > 1) {
              slotValues[name] = {
                confirmationStatus,
                id: valueWrappers[0].value.id,
                isAmbiguous: true,
                isMatch: true,
                name,
                resolved: valueWrappers[0].value.name,
                value: value as string,
                values: valueWrappers.map((valueWrapper) => valueWrapper.value),
              };
              break;
            }

            slotValues[name] = {
              name,
              value: value as string,
              isMatch: true,
              resolved: valueWrappers[0].value.name,
              id: valueWrappers[0].value.id,
              isAmbiguous: false,
              values: [],
              confirmationStatus,
            };
            break;
          case "ER_SUCCESS_NO_MATCH":
            slotValues[name] = {
              name,
              value,
              isMatch: false,
              confirmationStatus,
            };
            break;
          default:
            break;
        }
      } else {
        slotValues[name] = {
          name,
          value,
          isMatch: false,
          confirmationStatus,
        };
      }
    });
  }

  return slotValues;
}

/**
 * Wraps the given string as an interjection.
 *
 * @param str
 */
export function Interject(str: string): string {
  return `<say-as interpret-as="interjection">${str}</say-as>`;
}

/**
 * Creates an error with the given message and type.
 *
 * @param msg
 * @param type
 */
export function CreateError(
  msg: string = "Something unexpected happened.",
  type: string = ErrorTypes.Unknown,
): Error {
  const error = new Error(msg);
  error.name = type;

  return error;
}

/**
 * Returns a VoicePlayer.Speak directive with the given speech. Useful for sending progressive responses.
 *
 * @param handlerInput
 * @param speech
 */
export function VoicePlayerSpeakDirective(handlerInput: HandlerInput, speech?: string):
  services.directive.SendDirectiveRequest {
  const requestId = handlerInput.requestEnvelope.request.requestId;

  return {
    directive: {
      type: "VoicePlayer.Speak",
      speech,
    },
    header: {
      requestId,
    },
  };
}
