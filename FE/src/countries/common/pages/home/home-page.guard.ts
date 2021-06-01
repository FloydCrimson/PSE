import { PSELanguageGuardProvider } from '@pse-fe/core';

export const HomePageLanguageGuardProvider = PSELanguageGuardProvider('home-page', ['home-page.json']);
export const HomePageLanguageGuardToken = HomePageLanguageGuardProvider.provide;
