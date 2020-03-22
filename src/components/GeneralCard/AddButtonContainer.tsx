import React from 'react';
import {
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
  connect,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import { General } from '3594t-deck';
import { State } from '../../store';
import {
  DeckCardGeneral,
  DeckCard,
  SameCardConstraint,
  deckActions,
} from '../../modules/deck';
import isEnabledAddDeck from '../../containers/Common/isEnabledAddDeck';

interface StateFromProps {
  enabledAddDeck: boolean;
}

type DispatchFromProps = {
  onAddDeck: (card: DeckCardGeneral) => void;
};

interface OwnProps {
  general: General;
  show?: boolean;
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

class AddButton extends React.PureComponent<Props> {
  private handleAddDeckClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const { general, onAddDeck } = this.props;
    event.stopPropagation();
    const genMain = event.currentTarget.dataset['genMain'];
    onAddDeck({
      general: general.id,
      genMain,
      pocket: false,
    });
  };

  public render(): React.ReactNode {
    const { general, enabledAddDeck } = this.props;
    const genMains: JSX.Element[] = [];
    general.genMains.forEach((genMain, i) => {
      genMains.push(
        <button
          className="gen-main"
          key={i}
          disabled={!enabledAddDeck}
          data-gen-main={genMain.id}
          onClick={this.handleAddDeckClick}
        >
          {genMain.nameShort}
          <FontAwesomeIcon className="add-icon" icon={faPlusCircle} />
          <FontAwesomeIcon className="change-icon" icon={faSyncAlt} />
        </button>
      );
    });
    return (
      <>
        <span className="gen-mains" data-label="主将器">
          {genMains}
        </span>
        <span className="buttons">
          <button
            className="add-deck"
            disabled={!enabledAddDeck}
            onClick={this.handleAddDeckClick}
          >
            <FontAwesomeIcon className="add-icon" icon={faPlusCircle} />
            <FontAwesomeIcon className="change-icon" icon={faSyncAlt} />
          </button>
        </span>
      </>
    );
  }
}

interface ContainerStateFromProps {
  generals: General[];
  deckCards: DeckCard[];
  activeIndex: number | null;
  sameCard: SameCardConstraint;
}

interface ContainerDispatchFromProps {
  addDeckGeneral: (card: DeckCardGeneral) => void;
  changeDeckGeneral: (index: number, card: DeckCardGeneral) => void;
}

type TMapStateToProps = MapStateToProps<
  ContainerStateFromProps,
  OwnProps,
  State
>;
type TMapDispatchToProps = MapDispatchToProps<
  ContainerDispatchFromProps,
  OwnProps
>;
type TMergeProps = MergeProps<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>;

const mapStateToProps: TMapStateToProps = state => ({
  generals: state.datalistReducer.generals,
  deckCards: state.deckReducer.deckCards,
  activeIndex: state.deckReducer.activeIndex,
  sameCard: state.deckReducer.deckConstraints.sameCard,
});

const mapDispatchToProps: TMapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addDeckGeneral: deckActions.addDeckGeneral,
      changeDeckGeneral: deckActions.changeDeckGeneral,
    },
    dispatch
  );
};

interface DeckPersonalStrat {
  personal: string;
  strat: string;
}

// デッキに含まれている武将名と計略の配列を返す
function createDeckPersonals(
  state: ContainerStateFromProps,
  deckCards: DeckCard[]
): DeckPersonalStrat[] {
  const { generals, activeIndex } = state;
  const deckGenerals: string[] = [];
  deckCards.forEach((deckCard, i) => {
    if (activeIndex === i) {
      return;
    }
    if ('general' in deckCard) {
      deckGenerals.push(deckCard.general);
    }
  });
  return generals
    .filter(general => {
      return deckGenerals.includes(general.id);
    })
    .map(v => {
      const { personal, strat } = v.raw;
      return { personal, strat };
    });
}

function isEnabledAddDeckGeneral(
  general: General,
  deckPersonals: DeckPersonalStrat[],
  sameCard: SameCardConstraint
): boolean {
  if (sameCard === 'personal-strategy') {
    return !deckPersonals.some(
      r => r.personal === general.raw.personal && r.strat === general.raw.strat
    );
  } else {
    return !deckPersonals.some(r => r.personal === general.raw.personal);
  }
}

const mergeProps: TMergeProps = (state, actions, ownProps) => {
  const { deckCards, activeIndex, sameCard } = state;
  const { general } = ownProps;
  // デッキにいる武将(武将名-計略単位)
  const deckPersonals = createDeckPersonals(state, deckCards);
  const enabledAddDeck =
    isEnabledAddDeck(deckCards, activeIndex) &&
    isEnabledAddDeckGeneral(general, deckPersonals, sameCard);
  const sProps: StateFromProps = {
    enabledAddDeck,
  };
  const dProps: DispatchFromProps = {
    onAddDeck: (card: DeckCardGeneral) => {
      if (!enabledAddDeck) {
        return;
      }
      if (activeIndex != null) {
        actions.changeDeckGeneral(activeIndex, card);
      } else {
        actions.addDeckGeneral(card);
      }
    },
  };
  return {
    ...sProps,
    ...dProps,
    ...ownProps,
  };
};

export default connect<
  ContainerStateFromProps,
  ContainerDispatchFromProps,
  OwnProps,
  Props
>(mapStateToProps, mapDispatchToProps, mergeProps, {
  areMergedPropsEqual: (nextMergedProps, prevMergedProps) => {
    // 前回・今回共に非表示なら再描画しない
    if (!nextMergedProps.show && !prevMergedProps.show) {
      return true;
    }
    return false;
  },
})(AddButton);
