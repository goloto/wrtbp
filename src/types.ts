export enum Languages {
    English = 'enGB',
    Chinease = 'zhCN',
    Spanish = 'esES',
    Japanies = 'jaJP',
    Russian = 'ruRU',
    German = 'deDE',
    French = 'frFR',
}

type Id = string;
type Key = string;

export interface PureDictionaryItem {
    source: Languages,
    key: Key;
    ownerGuid: Id;
    languages: LocalizedString[];
    string_traits?: StringTrait[],
}

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

enum DictionaryItemTypes {
    Encyclopedia = 'Encyclopedia',
    UnitStat = 'unit_stat',
    ConsoleBind = 'console_bind',
}

export enum ArchetypeNames {
    Adept = 'Adept',
    Assassin = 'Assassin',
    Fighter = 'Fighter',
    Hunter = 'Hunter',
    Leader = 'Leader',
    Psyker = 'Psyker',
    Soldier = 'Soldier',
    Strategist = 'Strategist',
    Tactician = 'Tactician',
    Vanguard = 'Vanguard',
    Veteran = 'Veteran',
}

export enum ArchetypeItemNames {
    Abilities = 'Abilities',
    Career = 'Career',
    Talents = 'Talents',
    Ultimate = 'Ultimate'
}

export enum CommonArchitypes {
    Ascension = 'ascension',
    Cannoness = 'cannoness',
    CommonFeatures = 'commonFeatures',
    _Forcemeister = 'forcemeister',
    Navigator = 'navigator',
    StatAdvancements = 'statAdvancements',
    Technomat = 'technomat',
    Witch = 'witch',
}

interface Link {
    type: DictionaryItemTypes;
    key: Key;
}

export interface ArchetypeItem extends PureDictionaryItem {
    class: ArchetypeNames;
    type: ArchetypeItemNames,
    name: string;
    links?: Link[];
}

// 1. парсим
// 2. выкидываем файлы с _Title
// 3. формируем файл по _Description
// 4. формируем ссылки
// 5. формируем имя из _Title

// Всегда получаем два массива - один с данными, второй тоже с данными, но сформированный из всех ссылок
