import {DictionaryItemTypes, Languages} from './constants';

export type Id = string;
type Key = string;

interface LocalizedString {
    TranslatorComment?: string;
    locale: Languages;
    text: string;
    modification_date: Date;
    translated_from: Languages;
    translation_date: Date;
    original_text: string;
    traits?: StringTrait[];
}

interface StringTrait {
    trait: string;
    trait_date: Date;
    locale_text: string;
}

export interface Link {
    type: DictionaryItemTypes;
    key: Key;
}
