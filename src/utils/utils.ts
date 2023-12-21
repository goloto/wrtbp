import {ArchetypeNames, ArchetypeItemNames, PureDictionaryItem} from '../types';
import {extname} from 'path';

export const isInstance = <T extends object>(value: string | number, type: T): type is T =>
    Object.values(type).includes(value)

export const getClassItemNameFromPath = (path: string): ArchetypeItemNames | null => {
    for (const archetypeItem in ArchetypeItemNames) {
        if (path.toLowerCase().includes(ArchetypeItemNames[archetypeItem].toLowerCase())) {
            return ArchetypeItemNames[archetypeItem];
        }
    }

    return null;
}

export const isPureItem = (file: string): file is PureDictionaryItem => {

}

export const isJsonFile = (fileName: string) => {
    return extname(fileName).toLowerCase().includes('json');
}

export const getFilenameFromPath = (filePath: string): string => {
    const directories: Array<string> = filePath.split('\/');

    return directories.slice(-1)?.[0];
}

export const getChildFromPath = (filePath: string, num: number): string => {
    const directories: Array<string> = filePath.split('\/');

    return directories[num];
}

export const getClassItemFromFileName = (fileName: string): ArchetypeItemNames => {
    return fileName.split('_')[1];
}

export const isFileDescription = (str: string): boolean => {

}

export const isFileTitle = (str: string): boolean => {

}


