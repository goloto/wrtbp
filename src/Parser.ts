import {Id} from './types';
import {JbpClass, SerializedClassItem} from './JbpClass';
import {JbpEncyclopedia, SerializedEncyclopediaItem} from './JbpEncyclopedia';
import {readdir, readFile, writeFile} from 'fs/promises';
import {isJbpFile} from './utils';

interface LocalizationItem {
    Offset: number;
    Text: string;
}

export class Parser {
    constructor() {
        this.localization = new Map();
        this.classes = new Map();
        this.encyclopedia = new Map();
    }

    public localization: Map<Id, LocalizationItem>;
    public classes: Map<Id, SerializedClassItem>;
    public encyclopedia: Map<Id, SerializedEncyclopediaItem>;

    public async parseLocalization(filePath: string) {
        const localizationString = await readFile(filePath, {encoding: 'utf-8'});
        const localization: {strings: Record<Id, LocalizationItem>} = JSON.parse(localizationString).strings;

        this.localization = new Map(Object.entries(localization));
    }

    public async parseClasses(dir: string) {
        const missingLocalizationItems: Set<Id> = new Set();
        const allRelativeFilePaths = await readdir(dir, {recursive: true});

        for (let i = 0; i < allRelativeFilePaths.length; i++) {
            const relativeFilePath = allRelativeFilePaths[i];

            if (!isJbpFile(relativeFilePath)) {
                continue;
            }

            const path = `${dir}/${relativeFilePath}`;
            const fileContent = await readFile(path, {encoding: 'utf-8'});

            const jbpClass = new JbpClass(fileContent, relativeFilePath);

            if (!jbpClass.isCorrectClass) {
                continue;
            }

            if (!jbpClass.haveTranslation()) {
                continue;
            }

            if (jbpClass.isShadowDeleted) {
                continue;
            }

            if (!this.localization.has(jbpClass.descriptionId) && !this.localization.has(jbpClass.titleId)) {
                missingLocalizationItems.add(jbpClass.id);
                continue;
            }

            this.classes.set(jbpClass.id, jbpClass.serialize());
        }

        console.log(`classes items count: ${this.classes.size}`);
        console.log('classes non-localized items count', missingLocalizationItems.size);
        console.log('classes non-localized items', Array.from(missingLocalizationItems));
    }

    public async parseEncyclopedia(dir: string) {
        const missingLocalizationItems: Set<Id> = new Set();
        const allRelativeFilePaths = await readdir(dir, {recursive: true});

        for (let i = 0; i < allRelativeFilePaths.length; i++) {
            const relativeFilePath = allRelativeFilePaths[i];

            if (!isJbpFile(relativeFilePath)) {
                continue;
            }

            const path = `${dir}/${relativeFilePath}`;
            const fileContent = await readFile(path, {encoding: 'utf-8'});
            const encyclopediaItem = new JbpEncyclopedia(fileContent, relativeFilePath);

            if (!encyclopediaItem.isCorrectEncyclopediaType) {
                continue;
            }

            if (!encyclopediaItem.haveTranslation()) {
                continue;
            }

            if (encyclopediaItem.isShadowDeleted) {
                continue;
            }

            if (!this.localization.has(encyclopediaItem.descriptionId) && !this.localization.has(encyclopediaItem.titleId)) {
                missingLocalizationItems.add(encyclopediaItem.id);
                continue;
            }

            this.encyclopedia.set(encyclopediaItem.id, encyclopediaItem.serialize());
        }

        console.log(`encyclopedia items count: ${this.encyclopedia.size}`);
        console.log('encyclopedia non-localized items count', missingLocalizationItems.size);
        console.log('encyclopedia non-localized items', Array.from(missingLocalizationItems));
    }

    public async writeFiles() {
        await writeFile(`./output/class-items-${(new Date()).toISOString()}.json`, JSON.stringify(Object.fromEntries(this.classes)), 'utf8');
        await writeFile(`./output/encyclopedia-items-${(new Date()).toISOString()}.json`, JSON.stringify(Object.fromEntries(this.encyclopedia)), 'utf8');
    }
}
