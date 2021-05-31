import { LanguageGuardProvider } from 'countries/common/guards/language.guard';

export const UnauthPageLanguageGuardProvider = LanguageGuardProvider('unauth-page', ['unauth-page.json']);
export const UnauthPageLanguageGuardToken = UnauthPageLanguageGuardProvider.provide;
