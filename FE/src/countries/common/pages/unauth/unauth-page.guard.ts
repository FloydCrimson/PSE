import { PSELanguageGuardProvider } from '@pse-fe/core';

export const UnauthPageLanguageGuardProvider = PSELanguageGuardProvider('unauth-page', ['unauth-page.json']);
export const UnauthPageLanguageGuardToken = UnauthPageLanguageGuardProvider.provide;
