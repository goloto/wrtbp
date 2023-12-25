import {Id} from './types';

interface JbpBaseStructure<T extends JbpData> {
    AssetId: Id;
    Data: T;
    Meta: {ShadowDeleted?: boolean};
}

export type JbpData = {
    $type: `${string}, ${string}`;
}

export class Jbp<T extends JbpData> {
    constructor(str: string) {
        const json: JbpBaseStructure<T> = JSON.parse(str);

        this.id = json.AssetId;
        this._data = json.Data;
        this.meta = json.Meta;
        this.isShadowDeleted = json.Meta?.ShadowDeleted || false;
    }

    private _data: T;

    public id: Id;
    public meta: {ShadowDeleted?: boolean;}
    public isShadowDeleted: boolean;

    public get data() {
        return typeof this._data === 'object' ? this._data : null;
    }

    public get type() {
        return this._data.$type.split(', ')[1];
    }
}

export interface JbpString {
    m_Key?: string,
    m_OwnerString?: string;
    m_OwnerPropertyPath?: string;
    m_JsonPath?: string;
    Shared: {
        assetguid?: Id;
        stringkey?: Id;
    } | null,
}
