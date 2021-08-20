import type { BaseData as RawBaseData } from '@3594t-deck/3594t-net-datalist/read-only';
import type {
  FilterItem,
  Strategy,
  General,
  AssistStrategy,
  AssistGeneral,
  DefaultAssist,
  Personal,
  DataItem,
  FilterContents,
  BelongState,
  KeyDataItem,
} from '3594t-deck';
import generateAssistGeneral from './generateAssistGeneral';
import generateGeneral from './generateGeneral';
import generatePersonal from './generatePersonal';
import generateStrategy from './generateStrategy';
import { createVersionLabel } from '../utils/createVersionLabel';
import { UNIT_TYPE_NAME_SHORT_ALIAS } from '../const';

interface IdItem {
  readonly id: string;
}

export interface BaseData {
  filterContents: FilterContents;
  /** 武将 */
  generals: General[];
  /** 計略 */
  strategies: Strategy[];
  /** 遊軍 */
  assistGenerals: AssistGeneral[];
  /** デフォルト遊軍 */
  defaultAssist: DefaultAssist | null;
  /** 遊軍計略 */
  assistStrategies: AssistStrategy[];
}

/**
 * id として 配列のindexを採用する
 * @param {V} _ 値(使用しない)
 * @param {number} i 配列のindex
 * @return {string} id
 */
const idIsIndex = <V>(_: V, i: number): string => `${i}`;
/**
 * id として 値の key プロパティを使用する
 * @param {V} v 値
 * @return {string} id
 */
const idIsKey = <V extends { key: string }>(v: V): string => v.key;

const convertIdItem = <S, D extends IdItem>(
  array: readonly S[],
  convertId: (s: S, i: number) => string,
  convertValue: (t: S, id: string) => D
): D[] => array.map((s, i) => convertValue(s, convertId(s, i)));

const objectToIdItems = <S, D extends IdItem>(
  obj: { [key: string]: S } | { [key: number]: S },
  convertValue: (t: S, id: string) => D
): D[] => Object.entries(obj).map(([key, s]) => convertValue(s, `${key}`));

const toItem = <S>(s: S, id: string): S & IdItem => ({
  ...s,
  id,
});

const toFilterItem = (
  {
    code,
    name,
    name_short: nameShort,
    short_name: shortName,
  }: {
    code: string;
    name: string;
    /* eslint-disable camelcase */
    name_short?: string;
    short_name?: string;
    /* eslint-enable camelcase */
  },
  id: string
): FilterItem => ({
  id,
  code,
  name,
  nameShort: nameShort || shortName,
});

const emptyDataItem: IdLess<DataItem> = {
  code: '',
  name: '',
};

const emptyKeyDataItem: IdLess<KeyDataItem> = {
  code: '',
  name: '',
  key: '',
};

type IdLess<T> = Omit<T, 'id'>;

const emptyBelongState: IdLess<BelongState> = {
  code: '',
  name: '',
  nameShort: '',
  color: '',
  thincolor: '',
};

const emptyPersonal: IdLess<Personal> = {
  azana: '',
  azanaRuby: '',
  name: '',
  nameRuby: '',
  uniqueId: '',
  azanaSearchText: null,
  nameSearchText: null,
};

const emptyStrategy: IdLess<Strategy> = {
  code: '',
  explanation: '',
  rawExplanation: '',
  morale: 1,
  name: '',
  nameRuby: '',
  stratCategory: '',
  stratCategoryName: '',
  stratRange: '',
  stratRangeCode: '',
  stratTime: '',
  nameSearchText: null,
};

const emptyAssistStrategy: IdLess<AssistStrategy> = {
  code: '',
  explanation: '',
  rawExplanation: '',
  name: '',
  nameRuby: '',
};

const findById = <D>(
  items: (D & IdItem)[],
  id: string,
  defaultValue: D
): D & IdItem => {
  const item = findByIdNullable(items, id);
  if (item) {
    return item;
  }
  return {
    ...defaultValue,
    id,
  };
};

const findByIdNullable = <D extends IdItem>(
  items: D[],
  id: string
): D | null => {
  const item = items.find((v) => v.id === id);
  if (!item) {
    return null;
  }
  return item;
};

const plain = <S>(s: (S | undefined)[]): S[] =>
  s.filter((v) => v != null) as S[];

const NO_SKILL_ID = '0';

const convertStrategyExplanation = (explanation: string): string => {
  return (
    explanation
      // brタグを改行化
      .replace(/\<br\s*\/?\>/gi, '\n')
      // imgタグを除去しaltを表記
      .replace(/\<img.+?alt=\"(.*?)\".*?\/\>/gi, ' $1 ')
  );
};

export default (baseData: RawBaseData): BaseData => {
  // 勢力
  const belongStates = convertIdItem(
    baseData.STATE,
    idIsIndex,
    ({ code, name, name_short: nameShort, red, green, blue }, id) => {
      return {
        id,
        code,
        name,
        nameShort,
        color: `rgb(${red}, ${green}, ${blue})`,
        thincolor: `rgba(${red}, ${green}, ${blue}, 0.2)`,
      };
    }
  );
  // コスト
  const costs = objectToIdItems(baseData.COST, toItem);
  // 兵種
  const unitTypes = convertIdItem(
    baseData.UNIT_TYPE,
    idIsKey,
    (s, id): KeyDataItem => ({
      ...s,
      id,
      nameShort: UNIT_TYPE_NAME_SHORT_ALIAS[s.name] || s.name[0],
    })
  );
  // 特技
  const skills = convertIdItem(baseData.SKILL, idIsKey, toFilterItem);
  // 主将器
  const genMains = convertIdItem(baseData.GEN_MAIN, idIsKey, (s, id) => {
    const dist = toFilterItem(s, id);
    return {
      ...dist,
      replace: s.replace === '1',
    };
  });
  // 奇才将器
  const genMainSps = convertIdItem(baseData.GEN_MAIN_SP, idIsKey, (s, id) => {
    const dist = toFilterItem(s, id);
    return {
      ...dist,
      replace: s.replace === '1',
    };
  });
  // レアリティ
  const rarities: DataItem[] = objectToIdItems(baseData.RARITY, toItem).sort(
    (a, b) => a.order - b.order
  );
  // 官職
  const generalTypes = convertIdItem(
    baseData.GENERAL_TYPE,
    idIsKey,
    (s, id) => {
      const dist = toItem(s, id);
      if (s.name === '') {
        return {
          ...dist,
          name: 'なし(女性)',
        };
      }
      return dist;
    }
  );
  // スターター/通常/Ex
  const verTypes = convertIdItem(
    baseData.VER_TYPE,
    idIsIndex,
    toFilterItem
  ).map((v) => {
    if (v.name === 'Ex') {
      return {
        ...v,
        name: 'EX',
      };
    }
    return v;
  });
  // 計略カテゴリ
  const strategyCategories = convertIdItem(
    baseData.STRAT_CATEGORY,
    idIsKey,
    toFilterItem
  );
  // 計略範囲
  const strategyRanges = convertIdItem(
    baseData.STRAT_RANGE,
    idIsIndex,
    (s, id) => ({
      id,
      code: s.code,
      name: '',
    })
  );
  // 計略
  const strategies = convertIdItem(
    baseData.STRAT,
    idIsKey,
    (strat, id): Strategy => {
      const { strat_category: stratCategory, strat_range: stratRange } = strat;
      const stratCategoryName =
        strategyCategories.find((sc) => sc.id === stratCategory)?.name || '';
      const stratRangeCode =
        strategyRanges.find((sr) => sr.id === stratRange)?.code || '';
      return generateStrategy(id, strat, {
        explanation: convertStrategyExplanation(strat.explanation),
        stratCategory,
        stratCategoryName,
        stratRange,
        stratRangeCode,
      });
    }
  );
  // 登場弾
  const versions: { [key: number]: number[] } = {};
  // 武将名
  const personals = convertIdItem(baseData.PERSONAL, idIsIndex, (raw, id) => {
    const personal: Personal = generatePersonal(id, raw);
    return personal;
  });
  // 武将
  const generals = convertIdItem(baseData.GENERAL, idIsIndex, (raw, id) => {
    const g: General = generateGeneral(id, raw, {
      cost: findById(costs, raw.cost, emptyDataItem),
      genMains: plain(
        [raw.gen_main0, raw.gen_main1, raw.gen_main2]
          .filter((v) => v !== '')
          .map((v) => genMains.find((g) => g.id === v))
      ),
      genMainSp: findByIdNullable(genMainSps, id),
      generalType: findById(generalTypes, raw.general_type, emptyKeyDataItem),
      personal: findById(personals, raw.personal, emptyPersonal),
      rarity: findById(rarities, raw.rarity, emptyDataItem),
      skills: plain(
        [raw.skill0, raw.skill1, raw.skill2]
          .filter((v) => v !== '' && v !== NO_SKILL_ID)
          .map((v) => skills.find((g) => g.id === v))
      ),
      state: findById(belongStates, raw.state, emptyBelongState),
      unitType: findById(unitTypes, raw.unit_type, emptyKeyDataItem),
      strategy: findById(strategies, raw.strat, emptyStrategy),
    });
    if (!versions[g.majorVersion]) {
      versions[g.majorVersion] = [];
    }
    if (!g.isEx && !versions[g.majorVersion].includes(g.addVersion)) {
      versions[g.majorVersion].push(g.addVersion);
    }
    return g;
  });
  const majorVersions = Object.keys(versions).map((v) => parseInt(v));
  const sortNumber = (a: number, b: number): number => {
    return a - b;
  };
  majorVersions.sort(sortNumber);
  majorVersions.forEach((major) => {
    versions[major].sort(sortNumber);
  });
  const strategyTimes = convertIdItem(
    baseData.STRAT_TIME,
    idIsIndex,
    toFilterItem
  );
  // 遊軍計略カテゴリ
  const assistStrategyCategories = convertIdItem(
    baseData.ASSIST_STRAT_CATEGORY,
    idIsKey,
    toFilterItem
  );
  // 遊軍計略
  const assistStrategies: AssistStrategy[] = convertIdItem(
    baseData.ASSIST_STRAT,
    idIsKey,
    (strat, id) => {
      const {
        code,
        key,
        name,
        explanation: rawExplanation,
        name_ruby: nameRuby,
        assist_strat_category: stratCategoryId,
        strat_range: stratRange,
      } = strat;
      const category = assistStrategyCategories.find(
        (sc) => sc.id === stratCategoryId
      );
      const range = strategyRanges.find((sr) => sr.id === stratRange);
      return {
        id,
        code,
        key,
        name,
        explanation: convertStrategyExplanation(rawExplanation),
        rawExplanation,
        nameRuby,
        category,
        range,
      };
    }
  );
  // 遊軍
  const assistGenerals = convertIdItem(
    baseData.ASSIST,
    idIsIndex,
    (raw, id): AssistGeneral => {
      const majorVersion = parseInt(raw.major_version);
      const addVersion = parseInt(raw.add_version);
      const isEx = false;
      if (!versions[majorVersion]) {
        versions[majorVersion] = [];
      }
      if (!isEx && !versions[majorVersion].includes(addVersion)) {
        versions[majorVersion].push(addVersion);
      }
      const personal = findById(personals, raw.personal, emptyPersonal);
      return generateAssistGeneral(id, raw, {
        majorVersion,
        addVersion,
        isEx,
        personal,
        state: findById(belongStates, raw.state, emptyBelongState),
        strategy: findById(
          assistStrategies,
          raw.assist_strat,
          emptyAssistStrategy
        ),
      });
    }
  );
  // デフォルト遊軍
  const defaultAssist: DefaultAssist | null =
    baseData.DEFAULT_ASSIST.length > 0
      ? (({
          assist_strat_category_name: strategyCategoryName,
          assist_strat_name: strategyName,
          code,
          name,
          avatar,
        }) => {
          return { strategyCategoryName, strategyName, code, name, avatar };
        })(baseData.DEFAULT_ASSIST[0])
      : null;
  return {
    filterContents: {
      belongStates,
      costs,
      unitTypes,
      skills,
      genMains,
      rarities,
      generalTypes,
      verTypes,
      versions: Object.entries(versions).map(([k, addVersions]) => {
        const items = convertIdItem(
          addVersions,
          (v) => `${k}-${v}`,
          (v, id) => ({ id, name: createVersionLabel(k, v) })
        );
        items.push({
          id: `${k}-EX`,
          name: createVersionLabel(k, 0, true),
        });
        return items;
      }),
      majorVersions: convertIdItem(
        majorVersions,
        (v) => `${v}`,
        (v, id) => ({ id, name: createVersionLabel(v) })
      ),
      strategyCategories,
      strategyRanges,
      strategyTimes,
      assistStrategyCategories,
    },
    generals,
    strategies,
    assistGenerals,
    defaultAssist,
    assistStrategies,
  };
};
