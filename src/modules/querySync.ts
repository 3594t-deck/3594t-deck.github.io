import type { ParamsOptions } from 'redux-query-sync';
import reduxQuerySync from 'redux-query-sync';
import type { General, AssistGeneral, FilterContents } from '3594t-deck';
import {
  DECK_COST_LIMIT,
  DECK_GENERAL_CARD_COUNT,
  DECK_ASSIST_CARD_COUNT,
  GEN_MAIN_AWAKENING_LIMIT,
  UNIT_TYPE_NAME_SHORT_ALIAS,
} from '../const';
import type { State } from '../store';
import store from '../store';
import type {
  DeckCard,
  KeyLessDeckCard,
  KeyLessDeckCardGeneral,
  KeyLessDeckCardDummy,
  DeckCardAssist,
  SameCardConstraint,
} from './deck';
import {
  isSameCardConstraint,
  defaultSameCardConstraint,
  deckActions,
} from './deck';

interface DataContents {
  generals: General[];
  filterContents: FilterContents;
}

const toQueryDeckCard = ({ generals, filterContents }: DataContents) => {
  return (deckCard: DeckCard): string => {
    if ('general' in deckCard) {
      const general = generals.find((g) => g.id === deckCard.general);
      if (!general) {
        return '';
      }
      const genMain = filterContents.genMains.find(
        (r) => r.id === deckCard.genMain
      );
      const code = deckCard.pocket ? general.pocketCode : general.code;
      const genMainCode =
        (genMain ? genMain.code : '') + (deckCard.genMainAwakening ? '*' : '');
      // 武将 (code)_(genMainCode)
      return [code, genMainCode].join('_');
    }
    const belongState = filterContents.belongStates.find(
      (r) => r.id === deckCard.belongState
    );
    const belongStateNameShort = belongState ? belongState.nameShort : '';
    const unitType = filterContents.unitTypes.find(
      (r) => r.id === deckCard.unitType
    );
    const unitTypeName = unitType
      ? UNIT_TYPE_NAME_SHORT_ALIAS[unitType.name] || unitType.name[0]
      : '';
    // ダミー __(cost)_(belongStateNameShort)_(unitTypeName[先頭1文字])
    return ['', '', deckCard.cost, belongStateNameShort, unitTypeName].join(
      '_'
    );
  };
};

const parseDeckCardGeneral = (
  {
    code,
    genMainCode,
    genMainAwakening,
  }: {
    code?: string;
    genMainCode?: string;
    genMainAwakening: boolean;
  },
  { generals, filterContents }: DataContents
): KeyLessDeckCardGeneral | null => {
  if (!code) {
    return null;
  }
  const general = generals.find(
    (g) => g.code === code || g.pocketCode === code
  );
  if (!general) {
    return null;
  }
  const pocket = general.code !== code;
  const genMain = filterContents.genMains.find((g) => g.code === genMainCode);
  let genMainid: string | undefined = undefined;
  if (genMain && general.genMains.includes(genMain)) {
    genMainid = genMain.id;
  }
  return {
    general: general.id,
    genMain: genMainid,
    genMainAwakening,
    pocket,
  };
};

const parseDeckCardDummy = (
  {
    cost,
    belongStateNameShort,
    unitTypeName,
  }: {
    cost?: string;
    belongStateNameShort?: string;
    unitTypeName?: string;
  },
  content: FilterContents
): KeyLessDeckCardDummy => {
  const belongState = content.belongStates.find(
    (r) => r.nameShort === belongStateNameShort
  );
  const unitType = content.unitTypes.find(
    (r) => (UNIT_TYPE_NAME_SHORT_ALIAS[r.name] || r.name[0]) === unitTypeName
  );
  return {
    cost: cost && content.costs.findIndex((r) => r.code === cost) ? cost : '10',
    belongState: belongState ? belongState.id : undefined,
    unitType: unitType ? unitType.id : undefined,
  };
};

const parseDeckCard = ({ generals, filterContents }: DataContents) => {
  return (v: string): KeyLessDeckCard => {
    const [code, genMain, cost, belongStateNameShort, unitTypeName] =
      v.split('_');
    const [genMainCode, awakening] = genMain.split('*');
    const g = parseDeckCardGeneral(
      { code, genMainCode, genMainAwakening: awakening === '' },
      { generals, filterContents }
    );
    if (g) {
      return g;
    }
    return parseDeckCardDummy(
      {
        cost,
        belongStateNameShort,
        unitTypeName,
      },
      filterContents
    );
  };
};

// defaultValue と=== 比較で一致する場合にparameterがなくなるので空を同一インスタンスに
const emptyDecks: KeyLessDeckCard[] = [];
const emptyAssistDecks: DeckCardAssist[] = [];

const deckParam: ParamsOptions<State, KeyLessDeckCard[]> = {
  action: deckActions.setDecks,
  selector: (state) => {
    const deckCards = state.deck.deckCards;
    if (deckCards.length === 0) {
      return emptyDecks;
    }
    return deckCards;
  },
  defaultValue: emptyDecks,
  valueToString: (deckCards) => {
    const { datalist } = store.getState();
    const toQuery = toQueryDeckCard({
      generals: datalist.generals,
      filterContents: datalist.filterContents,
    });
    return deckCards
      .map(toQuery)
      .filter((r) => r)
      .join('|');
  },
  stringToValue: (s) => {
    if (!s) {
      return emptyDecks;
    }
    const { datalist } = store.getState();
    const parse = parseDeckCard({
      generals: datalist.generals,
      filterContents: datalist.filterContents,
    });
    return s.split('|').map(parse);
  },
};

interface DataAssistContents {
  assistGenerals: AssistGeneral[];
}

const toQueryDeckCardAssist = ({ assistGenerals }: DataAssistContents) => {
  return (deckCardAssist: DeckCardAssist): string => {
    const assistGeneral = assistGenerals.find(
      (a) => a.id === deckCardAssist.assist
    );
    if (!assistGeneral) {
      return '';
    }
    return assistGeneral.code;
  };
};

const parseDeckCardAssist = ({ assistGenerals }: DataAssistContents) => {
  return (code: string): DeckCardAssist | null => {
    const assistGeneral = assistGenerals.find((a) => a.code === code);
    const assist = assistGeneral?.id ?? null;
    if (!assist) {
      return null;
    }
    return { assist };
  };
};

const assistParam: ParamsOptions<State, DeckCardAssist[]> = {
  action: deckActions.setAssists,
  selector: (state) => {
    const assistDeckCards = state.deck.assistDeckCards;
    if (assistDeckCards.length === 0) {
      return emptyAssistDecks;
    }
    return assistDeckCards;
  },
  defaultValue: emptyAssistDecks,
  valueToString: (assistDeckCards) => {
    const { datalist } = store.getState();
    const toQuery = toQueryDeckCardAssist({
      assistGenerals: datalist.assistGenerals,
    });
    return assistDeckCards
      .map(toQuery)
      .filter((r) => r)
      .join('|');
  },
  stringToValue: (s) => {
    if (!s) {
      return emptyAssistDecks;
    }
    const { datalist } = store.getState();
    const parse = parseDeckCardAssist({
      assistGenerals: datalist.assistGenerals,
    });
    return s
      .split('|')
      .map(parse)
      .filter((d): d is DeckCardAssist => !!d);
  },
};

function generateNumberParamsOptions(
  options: Pick<ParamsOptions<State, number>, 'action' | 'selector'>,
  {
    min = 0,
    max,
    defaultValue,
    step = 1,
  }: {
    min?: number;
    max: number;
    defaultValue: number;
    step?: number;
  }
): ParamsOptions<State, number> {
  return {
    ...options,
    defaultValue,
    stringToValue: (s) => {
      try {
        const v = parseInt(s);
        if (v >= min && v <= max && v % step === 0) {
          return v;
        }
      } catch (e) {}
      return defaultValue;
    },
  };
}

const costParam: ParamsOptions<State, number> = generateNumberParamsOptions(
  {
    action: (limitCost) => deckActions.setDeckConstraints({ limitCost }),
    selector: (state) => state.deck.deckConstraints.limitCost,
  },
  DECK_COST_LIMIT
);

// 過去に使っていた同名武将の制約
const oldSameCardConstraints = [
  'personal-strategy-exclude-assist',
  'personal-assist',
];

const sameCardParam: ParamsOptions<State, SameCardConstraint> = {
  action: (sameCard) => deckActions.setDeckConstraints({ sameCard }),
  selector: (state) => state.deck.deckConstraints.sameCard,
  defaultValue: defaultSameCardConstraint,
  stringToValue: (s) => {
    if (isSameCardConstraint(s)) {
      return s;
    }
    if (oldSameCardConstraints.includes(s)) {
      return 'personal-strategy';
    }
    return defaultSameCardConstraint;
  },
};

const generalLimitParam: ParamsOptions<State, number> =
  generateNumberParamsOptions(
    {
      action: (generalCardLimit) =>
        deckActions.setDeckConstraints({ generalCardLimit }),
      selector: (state) => state.deck.deckConstraints.generalCardLimit,
    },
    DECK_GENERAL_CARD_COUNT
  );

const assistLimitParam: ParamsOptions<State, number> =
  generateNumberParamsOptions(
    {
      action: (assistCardLimit) =>
        deckActions.setDeckConstraints({ assistCardLimit }),
      selector: (state) => state.deck.deckConstraints.assistCardLimit,
    },
    DECK_ASSIST_CARD_COUNT
  );

const genMainLimitParam: ParamsOptions<State, number> =
  generateNumberParamsOptions(
    {
      action: (genMainAwakeningLimit) =>
        deckActions.setDeckConstraints({ genMainAwakeningLimit }),
      selector: (state) => state.deck.deckConstraints.genMainAwakeningLimit,
    },
    GEN_MAIN_AWAKENING_LIMIT
  );

const exchangeParam: ParamsOptions<State, boolean> = {
  action: (exchange) => deckActions.setDeckConstraints({ exchange }),
  selector: (state) => state.deck.deckConstraints.exchange,
  defaultValue: false,
  valueToString: (exchange) => (exchange ? 'on' : ''),
  stringToValue: (s) => s != null && s.toLowerCase() === 'on',
};

let init = false;

export default function (): void {
  if (init) {
    return;
  }
  reduxQuerySync<State>({
    store,
    params: {
      deck: deckParam,
      assist: assistParam,
      cost: costParam,
      ['same_card']: sameCardParam,
      ['general_limit']: generalLimitParam,
      ['assist_limit']: assistLimitParam,
      ['exchange']: exchangeParam,
      ['gen_main_limit']: genMainLimitParam,
    },
    initialTruth: 'location',
  });
  init = true;
}
