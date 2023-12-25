import {extname} from 'path';

export const isInstance = <T extends Record<string, string | number>>(value: string | number, type: T): value is T[keyof T] => {
    for (const currentValue of Object.values(type)) {
        if (value === currentValue) {
            return true;
        }
    }

    return false;
}

export const isJbpFile = (fileName: string) => {
    return extname(fileName).toLowerCase().includes('.jbp');
}

export const getChildFromPath = (filePath: string, num?: number): string => {
    const directories: Array<string> = filePath.split('\/');

    if (num === undefined) {
        return directories[directories.length - 1];
    }

    return directories[num];
}
