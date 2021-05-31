import { LanguageGuardProvider } from 'countries/common/guards/language.guard';

export const HomePageLanguageGuardProvider = LanguageGuardProvider('home-page', ['home-page.json']);
export const HomePageLanguageGuardToken = HomePageLanguageGuardProvider.provide;
