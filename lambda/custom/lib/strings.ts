import { IResource } from "../typings";
import { LocaleTypes, Strings } from "./constants";

interface IStrings {
  [Strings.WELCOME_MSG]: string;
  [Strings.GOODBYE_MSG]: string;
  [Strings.HELLO_MSG]: string;
  [Strings.HELP_MSG]: string;
  [Strings.ERROR_MSG]: string;
  [Strings.ERROR_UNEXPECTED_MSG]: string;
}

export const strings: IResource = {
  [LocaleTypes.enUS]: {
    translation: {
      ERROR_MSG: "Sorry, I can't understand the command. Please say again.",
      ERROR_UNEXPECTED_MSG: "Sorry, an unexpected error has occured. Please try again later.",
      FALLBACK_MSG: "This skill can't help you with that.",
      FALLBACK_REPROMPT: "What can I help you with?",
      GOODBYE_MSG: "Goodbye!",
      HELLO_MSG: "Hello world!",
      HELP_MSG: "You can say hello to me!",
      WELCOME_MSG: "Welcome to the Alexa Skills Kit, you can say hello!",
    } as IStrings,
  },
  [LocaleTypes.deDE]: {
    translation: {
      ERROR_MSG: "Sorry, Ich kann den Befehl nicht verstehen. Bitte sag es noch einmal.",
      ERROR_UNEXPECTED_MSG: "Sorry, ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.",
      FALLBACK_MSG: "Dieser Skill kann dir damit nicht helfen.",
      FALLBACK_REPROMPT: "Wie kann ich dir helfen?",
      GOODBYE_MSG: "Tschüss!",
      HELLO_MSG: "Hallo Welt!",
      HELP_MSG: "Du kannst Hallo zu mir sagen!",
      WELCOME_MSG: "Willkommen zum Alexa Skill Kit, du kannst hallo sagen!",
    } as IStrings,
  },
};
