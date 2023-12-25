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
        this.fullLocalization = new Map();
        this.liteLocalization = new Map();
        this.classes = new Map();
        this.encyclopedia = new Map();
        this.encyclopediaLinksReferences = new Map();
    }

    public fullLocalization: Map<Id, LocalizationItem>;
    public liteLocalization: Map<Id, string>;
    public classes: Map<Id, SerializedClassItem>;
    public encyclopedia: Map<Id, SerializedEncyclopediaItem>;
    public encyclopediaLinksReferences: Map<string, {titleId: Id; descriptionId: Id;}>;

    public async parseLocalization(filePath: string) {
        const localizationString = await readFile(filePath, {encoding: 'utf-8'});
        const localization: {strings: Record<Id, LocalizationItem>} = JSON.parse(localizationString).strings;

        this.fullLocalization = new Map(Object.entries(localization));
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

            if (!this.fullLocalization.has(jbpClass.descriptionId) || !this.fullLocalization.has(jbpClass.titleId)) {
                missingLocalizationItems.add(jbpClass.id);
                continue;
            }

            this.liteLocalization.set(jbpClass.descriptionId, this.fullLocalization.get(jbpClass.descriptionId).Text);
            this.liteLocalization.set(jbpClass.titleId, this.fullLocalization.get(jbpClass.titleId).Text);
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

            if (!this.fullLocalization.has(encyclopediaItem.descriptionId) || !this.fullLocalization.has(encyclopediaItem.titleId)) {
                missingLocalizationItems.add(encyclopediaItem.id);
                continue;
            }

            this.liteLocalization.set(encyclopediaItem.descriptionId, this.fullLocalization.get(encyclopediaItem.descriptionId).Text);
            this.liteLocalization.set(encyclopediaItem.titleId, this.fullLocalization.get(encyclopediaItem.titleId).Text);
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
