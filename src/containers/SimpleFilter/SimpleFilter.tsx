import './SimpleFilter.css';
import React from 'react';
import classNames from 'classnames';
import type { FilterItem, SearchMode } from '3594t-deck';
import type {
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import FilterButtonList from '../../components/FilterButtonList';

export interface StateFromProps {
  filterCondition: string[];
  filterContents: FilterItem[];
  searchByDeck: boolean;
  searchMode: SearchMode;
}

export interface DispatchFromProps {
  setSearchMode: (searchMode: SearchMode) => void;
  setCondition: (condition: Partial<BasicFilterCondition>) => void;
  toggleCheckList: (key: BasicFilterConditionKey, value: string) => void;
}

export type Props = StateFromProps & DispatchFromProps;

export default class SimpleFilter extends React.Component<Props> {
  private handleToggleCheckList = (
    key: BasicFilterConditionKey,
    value: string
  ): void => {
    this.props.toggleCheckList(key, value);
  };

  private handleOnClickToggleSearchMode = (): void => {
    const { searchMode, setSearchMode } = this.props;
    const newSearchMode = searchMode === 'general' ? 'assist' : 'general';
    setSearchMode(newSearchMode);
  };

  public render(): React.ReactNode {
    const { filterContents, filterCondition, searchByDeck, searchMode } =
      this.props;
    const modeGeneral = searchMode === 'general';
    return (
      <section className="simple-filter-section">
        <div className="simple-filter-state">
          <h2 className="title-inline">勢力</h2>
          <FilterButtonList<BasicFilterConditionKey>
            itemName="belongStates"
            items={filterContents}
            checkedItems={filterCondition}
            onClickItem={this.handleToggleCheckList}
            square={true}
            disabled={searchByDeck}
          />
        </div>
        <div
          className={classNames('search-mode', {
            'mode-general': modeGeneral,
          })}
          onClick={this.handleOnClickToggleSearchMode}
        >
          <span className="mode-item mode-item-general">武将</span>
          <span className="mode-item mode-item-assist">遊軍</span>
        </div>
      </section>
    );
  }
}
