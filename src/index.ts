import {readdir, readFile, writeFile} from 'fs/promises';
import {Id} from './types';
import {isJbpFile} from './utils';
import {SerializedClassItem, JbpClass} from './JbpClass';
import {JbpEncyclopedia, SerializedEncyclopediaItem} from './JbpEncyclopedia';

// 1. parseEncyclopedia
// 2. parseClasses
// 2.1 Ascension
// 2.2 CommonFeatures
// 2.3 StatAdvancements
// 2.4 Witch
// 2.5 Cannoness
// 2.6 CommonSelections
// 2.7 Forcemeister
// 2.8 Navigator
// 2.9 Psyker
// 2.10 Technomant
// 3. parseCompanionFeatures
// 4. parseSoulMarks
// 5. добавить тесты на проверку всех сущностей на сторонние символы [_ / \ {g } и т.д.]


export const parseClasses = async () => {
    const classesDir = '/Users/newton-goloto/Documents/_dev/Blueprints/Classes';
    const map = new Map<Id, SerializedClassItem>();
    const set = new Set<string>();
    const allRelativeFilePaths = await readdir(classesDir, {recursive: true});
    const localizationString = await readFile('/Users/newton-goloto/Documents/_dev/wrtbp/ruRU.json', {encoding: 'utf-8'});
    const localization = JSON.parse(localizationString);

    for (let i = 0; i < allRelativeFilePaths.length; i++) {
        const relativeFilePath = allRelativeFilePaths[i];

        if (!isJbpFile(relativeFilePath)) {
            continue;
        }

        const path = `${classesDir}/${relativeFilePath}`;
        const fileContent = await readFile(path, {encoding: 'utf-8'});

        const jbpClass = new JbpClass(fileContent, relativeFilePath);

        if (!jbpClass.isCorrectClass) {
            continue;
        }

        if (!jbpClass.haveTranslation()) {
            continue;
        }

        if (!localization?.strings?.[jbpClass.descriptionId] && !localization?.strings?.[jbpClass.titleId]) {
            set.add(`${jbpClass.id} - ${jbpClass.meta?.ShadowDeleted}`);
        }

        map.set(jbpClass.id, jbpClass.serialize());
        // set.add(jbpClass.type);
    }

    console.log(`classes items count: ${map.size}`);
    console.log('classes non-localized items count', set.size);
    console.log('classes non-localized items', Array.from(set));

    await writeFile(`./output/class-items-${(new Date()).toISOString()}.json`, JSON.stringify(Object.fromEntries(map)), 'utf8');
}

export const parseEncyclopedia = async () => {
    const encyclopediaDir = '/Users/newton-goloto/Documents/_dev/Blueprints/Encyclopedia';
    const map = new Map<Id, SerializedEncyclopediaItem>();
    const set = new Set();
    const allRelativeFilePaths = await readdir(encyclopediaDir, {recursive: true});
    const localizationString = await readFile('/Users/newton-goloto/Documents/_dev/wrtbp/ruRU.json', {encoding: 'utf-8'});
    const localization = JSON.parse(localizationString);

    for (let i = 0; i < allRelativeFilePaths.length; i++) {
        const relativeFilePath = allRelativeFilePaths[i];

        if (!isJbpFile(relativeFilePath)) {
            continue;
        }

        const path = `${encyclopediaDir}/${relativeFilePath}`;
        const fileContent = await readFile(path, {encoding: 'utf-8'});

        const encyclopediaItem = new JbpEncyclopedia(fileContent, relativeFilePath);

        if (!encyclopediaItem.isCorrectEncyclopediaType) {
            continue;
        }

        if (!encyclopediaItem.haveTranslation()) {
            continue;
        }

        if (!localization?.strings?.[encyclopediaItem.descriptionId] && !localization?.strings?.[encyclopediaItem.titleId]) {
            set.add(`${encyclopediaItem.id} - ${encyclopediaItem.meta?.ShadowDeleted}`);
        }

        map.set(encyclopediaItem.id, encyclopediaItem.serialize());
        // set.add(encyclopediaItem.type);
    }

    console.log(`encyclopedia items count: ${map.size}`);
    console.log('encyclopedia non-localized items count', set.size);
    console.log('encyclopedia non-localized items', Array.from(set));

    await writeFile(`./output/encyclopedia-items-${(new Date()).toISOString()}.json`, JSON.stringify(Object.fromEntries(map)), 'utf8');
}

// парсим энциклопедию

// парсим файл локализации, сравниваем его с предыдущими и выкидываем все лишние строки
