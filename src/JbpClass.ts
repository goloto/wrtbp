import {Jbp, JbpData, JbpString} from './Jbp';
import {Id} from './types';
import {Class, ClassOriginType, ClassRange, Skills, PsychicPower, ClassType} from './constants';
import {getChildFromPath, isInstance} from './utils';

interface JbpClassItem extends JbpData {
    m_DisplayName?: JbpString,
    m_Description?: JbpString,
    Type?: ClassOriginType,
    Range?: ClassRange,
    CooldownRounds?: number,
    CanTargetPoint?: boolean,
    CanTargetEnemies?: boolean,
    CanTargetFriends?: boolean,
    CanTargetSelf?: boolean,
    ParamsSkill?: Skills,
    PsychicPower?: PsychicPower;
    AbilityParamsSource?: string;
    DisableLog?: boolean;
}

export interface SerializedClassItem {
    id: Id;
    className: Class;
    classType: ClassType | null;
    titleId: Id;
    descriptionId: Id;
    originType?: ClassOriginType;
    range?: ClassRange;
    actionPointCost?: number;
    paramsSkill?: Skills;
}

enum ClassTypes {
    BlueprintAbility = 'BlueprintAbility',
    BlueprintBuff = 'BlueprintBuff',
    BlueprintFeature = 'BlueprintFeature',
    BlueprintAbilityAreaEffect = 'BlueprintAbilityAreaEffect',
}

export class JbpClass extends Jbp<JbpClassItem> {
    constructor(json: string, filePath: string) {
        super(json);

        this.classType =  getChildFromPath(filePath, 1);
        this.className = getChildFromPath(filePath, 0);
    }

    private _class: Class;
    private _classType: ClassType | null;

    public isCorrectClass: boolean;

    public get titleId() {
        return this.data?.m_DisplayName?.Shared?.stringkey;
    }

    public get descriptionId() {
        return this.data?.m_Description?.Shared?.stringkey;
    }

    public set classType(name: string) {
        if (isInstance(name, ClassType)) {
            this._classType = name;
        } else {
            this._classType = null;
        }
    }

    public get classType(): ClassType | null {
        return this._classType;
    }

    public set className(name: string) {
        if (isInstance(name, Class)) {
            this._class = name;
            this.isCorrectClass = true;
        } else {
            this.isCorrectClass = false;
        }
    }

    public get className(): Class {
        return this._class;
    }

    public get originType() {
        return isInstance(this.data?.Type, ClassOriginType) ? this.data.Type : undefined
    }

    public get range() {
        return isInstance(this.data?.Range, ClassRange) ? this.data.Range : undefined
    }

    public get paramsSkill() {
        return isInstance(this.data?.ParamsSkill, Skills) ? this.data.ParamsSkill : undefined
    }

    public haveTranslation() {
        return !!this.descriptionId && !!this.titleId;
    }

    public serialize(): SerializedClassItem {
        return {
            id: this.id,
            titleId: this.titleId,
            descriptionId: this.descriptionId,
            className: this.className,
            classType: this.classType,
            originType: this.originType,
            range: this.range,
            paramsSkill: this.paramsSkill
        }
    }
}
