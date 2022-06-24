import { GenMainItem } from '3594t-deck';
import { GEN_MAIN_MORALE } from '../const';

interface GenMainParams {
  /** 知力 */
  readonly intelligence: number;
  /** 征圧力 */
  readonly conquest: number;
}

interface GenMainAllParams {
  /** 説明 */
  readonly description: string;
  /** 自身に影響するパラメータ */
  readonly self: GenMainParams;
  /** 所属勢力に影響するパラメータ */
  readonly states: { [key: string]: GenMainParams };
  /** 士気 */
  readonly morale: number;
  /** 最大士気 */
  readonly maxMorale: number;
}

const EMPTY_PARAMS: GenMainParams = {
  intelligence: 0,
  conquest: 0,
};

const EMPTY_OTHER_PARAMS = {
  states: {},
  morale: 0,
  maxMorale: 0,
};

const EMPTY_ALL_PARAMS: GenMainAllParams = {
  ...EMPTY_OTHER_PARAMS,
  description: '',
  self: EMPTY_PARAMS,
};

type GenMainParamsMap = { [key: string]: GenMainAllParams };

const genMainParams: GenMainParamsMap = {
  // 知力上昇
  ['64577c9cf5034bd53dea21522ffa5fa8']: {
    ...EMPTY_OTHER_PARAMS,
    description: '知力が上がる',
    self: {
      ...EMPTY_PARAMS,
      intelligence: 3,
    },
  },
  // 士気上昇
  ['7f4a12c7f93d7629d7cb63bc03ffd877']: {
    ...EMPTY_OTHER_PARAMS,
    description: '戦闘開始時に士気が上がる',
    self: EMPTY_PARAMS,
    morale: GEN_MAIN_MORALE,
  },
  // 征圧力上昇
  ['53713eb7257682080cd1da1e4f775026']: {
    ...EMPTY_OTHER_PARAMS,
    description: '征圧力が上がる',
    self: {
      ...EMPTY_PARAMS,
      conquest: 1,
    },
  },
  // 同盟者
  ['4dfe295dd8c2a8a3d52a6409ee8f4541']: {
    ...EMPTY_OTHER_PARAMS,
    description: '最大士気が上がる\nただし12より多くならない',
    self: EMPTY_PARAMS,
    maxMorale: 3,
  },
};

const genMainSpParams: GenMainParamsMap = {
  // 奸雄の覇道
  ['b25b1cafbf36743d7a5f95aff4016436']: {
    ...EMPTY_OTHER_PARAMS,
    description: '魏の味方の知力が上がり\n自身の征圧力が上がる',
    self: {
      ...EMPTY_PARAMS,
      conquest: 2,
    },
    states: {
      // 魏
      ['c27df45cf8cd8895e643247f78749d47']: {
        ...EMPTY_PARAMS,
        intelligence: 1,
      },
    },
  },
  // 孫呉の聖母
  ['8ddce862a12db91174487dbc91fae9af']: {
    ...EMPTY_OTHER_PARAMS,
    description: '呉の味方の知力が上がる',
    self: EMPTY_PARAMS,
    states: {
      // 呉
      ['8d4d2c028f86d6f5c0f5557234853d4e']: {
        ...EMPTY_PARAMS,
        intelligence: 2,
      },
    },
  },
  // 縦横無尽
  ['70ad519b63b128f52840c82303caef10']: {
    ...EMPTY_OTHER_PARAMS,
    description: '征圧力が上がる',
    self: {
      ...EMPTY_PARAMS,
      conquest: 3,
    },
  },
};

export function getGenMainParams(genMain: GenMainItem): GenMainAllParams {
  if (!genMain.code) {
    return EMPTY_ALL_PARAMS;
  }
  return genMainParams[genMain.code] || EMPTY_ALL_PARAMS;
}

export function getGenMainSpParams(genMainSp: GenMainItem): GenMainAllParams {
  if (!genMainSp.code) {
    return EMPTY_ALL_PARAMS;
  }
  return genMainSpParams[genMainSp.code] || EMPTY_ALL_PARAMS;
}
