import {Jbp, JbpData, JbpString} from './Jbp';
import {Id} from './types';
import {getChildFromPath, isInstance} from './utils';
import {ClassType, EncyclopediaTypeNames} from './constants';

interface EncyclopediaItem extends JbpData {
    Title?: JbpString;
    Description?: JbpString;
}

export interface SerializedEncyclopediaItem {
    id: Id;
    fileName: string;
    encyclopediaType: EncyclopediaTypeNames;
    titleId: Id;
    descriptionId: Id;
}

enum EncyclopediaTypes {
    BlueprintEncyclopediaPage = 'BlueprintEncyclopediaPage',
    BlueprintEncyclopediaGlossaryEntry = 'BlueprintEncyclopediaGlossaryEntry'
}

export class JbpEncyclopedia extends Jbp<EncyclopediaItem> {
    constructor(str: string, filePath: string) {
        super(str);

        this.encyclopediaType = getChildFromPath(filePath, 0)
        this.fileName = getChildFromPath(filePath).split('.jbp')[0];
    }

    private _encyclopediaType: EncyclopediaTypeNames | null;

    public fileName: string;
    public isCorrectEncyclopediaType: boolean;

    public set encyclopediaType(name: string) {
        if (isInstance(name, EncyclopediaTypeNames)) {
            this._encyclopediaType = name;
            this.isCorrectEncyclopediaType = true;
        } else {
            this._encyclopediaType = null;
            this.isCorrectEncyclopediaType = false;
        }
    }

    public get encyclopediaType(): EncyclopediaTypeNames | null {
        return this._encyclopediaType;
    }

    public get titleId() {
        return this.data.Title.m_Key || this.data.Title.Shared?.stringkey;
    }

    public get descriptionId() {
        return this.data.Description?.m_Key || this.data.Description?.Shared?.stringkey;
    }

    public haveTranslation(): boolean {
        return !!this.titleId && !!this.descriptionId;
    }

    public serialize() {
        return {
            id: this.id,
            titleId: this.titleId,
            descriptionId: this.descriptionId,
            encyclopediaType: this.encyclopediaType,
            fileName: this.fileName,
        }
    }
}
