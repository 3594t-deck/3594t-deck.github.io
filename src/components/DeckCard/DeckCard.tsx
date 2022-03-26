import './DeckCard.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import classNames from 'classnames';
import type { General } from '3594t-deck';
import { generalThumbUrl } from '../../utils/externalUrl';

interface Props {
  index: number;
  genMain?: string;
  genMainAwakening: boolean;
  genMainAwakeningCount: number;
  general: General;
  additionalParams: {
    force: number;
    intelligence: number;
    conquest: number;
  };
  pocket: boolean;
  active: boolean;
  search: boolean;
  enableMoveLeft: boolean;
  enableMoveRight: boolean;
  enableGenMainAwaken: boolean;
  exchangeForceIntelligence: boolean;
  onSelectGenMain: (index: number, genMain?: string) => void;
  onAwakenGenMain: (index: number, awaken: boolean) => void;
  onActive: (index: number) => void;
  onRemoveDeck: (index: number) => void;
  onToggleSearch: (
    index: number,
    condition: {
      belongState: string;
      cost: string;
      unitType: string;
    }
  ) => void;
  onShowDetail: (general: General) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
}

type MoveDirection = 'left' | 'right';

interface LocalState {
  moveFrom: MoveDirection | null;
}

export default class DeckCard extends React.PureComponent<Props, LocalState> {
  state: Readonly<LocalState> = { moveFrom: null };

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps === this.props) {
      return;
    }
    const diff = prevProps.index - this.props.index;
    if (diff === 0) {
      this.setState({ moveFrom: null });
    } else {
      this.setState({ moveFrom: diff > 0 ? 'right' : 'left' });
    }
  }

  private handleSelectGenMain = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const { index, onSelectGenMain } = this.props;
    let value: string | undefined = event.currentTarget.value;
    if (value == null || value === '') {
      value = undefined;
    }
    onSelectGenMain(index, value);
  };

  private handleAwakenGenMain = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.stopPropagation();
    const { index, genMainAwakening, enableGenMainAwaken, onAwakenGenMain } =
      this.props;
    const awaken = !genMainAwakening;
    if (awaken && !enableGenMainAwaken) {
      return;
    }
    onAwakenGenMain(index, awaken);
  };

  private handleActive = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onActive } = this.props;
    onActive(index);
  };

  private handleRemove = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onRemoveDeck } = this.props;
    onRemoveDeck(index);
  };

  private handleSearch = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onToggleSearch, general } = this.props;
    const condition = {
      cost: general.cost.id,
      belongState: general.state.id,
      unitType: general.unitType.id,
    };
    onToggleSearch(index, condition);
  };

  private handleShowDetail = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    this.setState({ moveFrom: null });
    const { general, onShowDetail } = this.props;
    onShowDetail(general);
  };

  private handleMoveLeft = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    this.setState({ moveFrom: null });
    const { index, onMoveLeft } = this.props;
    onMoveLeft(index);
  };

  private handleMoveRight = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    this.setState({ moveFrom: null });
    const { index, onMoveRight } = this.props;
    onMoveRight(index);
  };

  public render(): React.ReactNode {
    const {
      index,
      general,
      additionalParams,
      genMain,
      genMainAwakening,
      genMainAwakeningCount,
      active,
      search,
      pocket,
      enableMoveLeft,
      enableMoveRight,
      enableGenMainAwaken,
      exchangeForceIntelligence,
    } = this.props;
    const style: React.CSSProperties = {
      backgroundColor: general.state.thincolor,
    };
    const statecolor = general.state.color;
    const styleState: React.CSSProperties = {
      backgroundColor: statecolor,
    };
    const gradientcolors = [
      statecolor,
      `${statecolor} 30px`,
      'transparent 92px',
      'transparent',
    ].join(',');
    const styleShadow: React.CSSProperties = {
      background: `linear-gradient(-30deg, ${gradientcolors})`,
    };
    const skills: JSX.Element[] = [];
    general.skills.forEach((skill) => {
      skills.push(
        <span className="skill" key={skill.id}>
          {skill.nameShort}
        </span>
      );
    });
    if (skills.length === 0) {
      skills.push(
        <span className="no-skill" key={0}>
          特技なし
        </span>
      );
    }
    const genMains: JSX.Element[] = [];
    general.genMains.forEach((genMain, i) => {
      const gm = general.genMainSp || genMain;
      genMains.push(
        <option value={genMain.id} key={i}>
          {gm.nameShort}
        </option>
      );
    });
    const selectedGenMain = genMain != null ? genMain : '';
    const genMainLabel = general.genMainSp != null ? '奇才将器' : '主将器';
    const moveFrom = this.state.moveFrom;
    const indexClass = index % 2 === 0 ? 'even' : 'odd';
    const diamonds: JSX.Element[] = Array(genMainAwakeningCount)
      .fill(0)
      .map((_, i) => <span key={i} className="diamond" />);
    let genMainAwakenClass;
    if (genMainAwakening) {
      genMainAwakenClass = 'gen-main-awakening';
    } else if (enableGenMainAwaken) {
      genMainAwakenClass = 'gen-main-not-awakening';
    } else {
      genMainAwakenClass = 'gen-main-disable-awakening';
    }
    return (
      <div
        className={classNames('deck-card', indexClass, {
          active,
          'from-right': moveFrom === 'right',
          'from-left': moveFrom === 'left',
        })}
        style={style}
        onClick={this.handleActive}
      >
        <div className="deck-card-inner-top">
          <div className="general-thumb-wrap">
            <img
              className="general-thumb"
              src={generalThumbUrl(general, pocket)}
            />
          </div>
          <div className="shadow" style={styleShadow} />
          <span className="state" style={styleState}>
            {general.state.nameShort}
          </span>
          <span className="version" style={styleState}>
            {general.version}
          </span>
          <span className="cost" data-label="コスト">
            {general.cost.name}
          </span>
          <span className="unit" data-label="兵種">
            {general.unitType.nameShort}
          </span>
          <span className="name">
            <span className="rarity">{general.rarity.name}</span>
            {general.name}
          </span>
        </div>
        <div className="deck-card-inner-bottom">
          <span
            className={classNames('force', {
              additional: additionalParams.force > 0,
            })}
            data-label="武"
          >
            {(exchangeForceIntelligence
              ? general.intelligence
              : general.force) + additionalParams.force}
          </span>
          <span
            className={classNames('intelligence', {
              additional: additionalParams.intelligence > 0,
            })}
            data-label="知"
          >
            {(exchangeForceIntelligence
              ? general.force
              : general.intelligence) + additionalParams.intelligence}
          </span>
          <span
            className={classNames('conquest', {
              additional: additionalParams.conquest > 0,
            })}
            data-label="制圧"
          >
            {general.conquest + additionalParams.conquest}
          </span>
          <span className="skills">{skills}</span>
          <span className="gen-mains" data-label={genMainLabel}>
            <span className="gen-mains-select-wrapper">
              <select
                className="gen-mains-select"
                value={selectedGenMain}
                onChange={this.handleSelectGenMain}
              >
                <option value="" />
                {genMains}
              </select>
            </span>
            <button
              className={classNames('awaken-gen-main', genMainAwakenClass)}
              onClick={this.handleAwakenGenMain}
            >
              <span className="diamonds">{diamonds}</span>
              <span className="label">将器覚醒</span>
            </button>
          </span>
        </div>
        <div className="tool-box">
          <button className="remove" onClick={this.handleRemove}>
            <FontAwesomeIcon icon={faMinusCircle} className="circle-icon" />
          </button>
          <button
            className={classNames('tool-button', 'search', { enable: search })}
            title="勢力・コスト・兵種で絞り込み"
            onClick={this.handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button
            className="tool-button show-detail"
            title="武将詳細"
            onClick={this.handleShowDetail}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </button>
          <button
            className={classNames('tool-button', 'move-left', {
              enabled: enableMoveLeft,
            })}
            title="左へ移動"
            onClick={this.handleMoveLeft}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className={classNames('tool-button', 'move-right', {
              enabled: enableMoveRight,
            })}
            title="右へ移動"
            onClick={this.handleMoveRight}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    );
  }
}
