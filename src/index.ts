import {readdir, readFile} from 'fs/promises';
import {extname} from 'path';
import {ArchetypeNames, ArchetypeItem, ArchetypeItemNames, Languages, PureDictionaryItem} from './types';
import {
    getClassItemNameFromPath, getChildFromPath, getClassItemFromFileName,
    getFilenameFromPath, isInstance, isJsonFile, isPureItem
} from './utils/utils';

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


export const parse = async () => {
    const dir = '/Users/newton-goloto/Documents/_dev/Mechanics/Blueprints/Classes';
    const map = new Map<string, ArchetypeItem>();
    const idArray = [];
    const allRelativeFilePaths = await readdir(dir, {recursive: true});

    for (const relativeFilePath of allRelativeFilePaths) {
        if (!isJsonFile(relativeFilePath)) {
            break;
        }

        const path = `${dir}/${relativeFilePath}`;
        const fileName = getFilenameFromPath(relativeFilePath);
        const folder = getChildFromPath(relativeFilePath, 0);
        const fileContent = await readFile(path, {encoding: 'utf-8'});
        const json = JSON.parse(fileContent) as PureDictionaryItem;

        if (!isPureItem(json)) {
            break;
        }

        if (isInstance(folder, ArchetypeNames)) {
            const name = getClassItemFromFileName(fileName);
            const item = {
                ...json,
                name,
                class: directories[0],
                type: getClassItemNameFromPath(directories[1]),
                languages: json.languages.filter((lang) => lang.locale === Languages.English || lang.locale === Languages.Russian)
            };
            console.log('______item', JSON.stringify(item));
            map.set(name, item);

            idArray.push(json.key);
        }
    }

    // console.log(`idArray: ${JSON.stringify(idArray)}`)
    console.log(`idArray.length: ${idArray.length}`)
}


