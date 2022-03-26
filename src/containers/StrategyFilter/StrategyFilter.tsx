import './StrategyFilter.css';
import React from 'react';
import classNames from 'classnames';
import type { SearchMode, FilterContents } from '3594t-deck';
import type {
  StrategiesFilterCondition,
  StrategiesFilterConditionKey,
} from '../../modules/datalist';
import SwitchItem from '../../components/SwitchItem';
import SearchTextBox from '../../components/SearchTextBox';
import FilterButtonList from '../../components/FilterButtonList';
import StrategyCategoryButtonList from '../../components/StrategyCategoryButtonList';
import StrategyRangeButtonList from '../../components/StrategyRangeButtonList';
import NumberSelect from '../../components/NumberSelect';

export interface StateFromProps {
  searchMode: SearchMode;
  filterCondition: StrategiesFilterCondition;
  filterContents: FilterContents;
}

export interface DispatchFromProps {
  setCondition: (condition: Partial<StrategiesFilterCondition>) => void;
  toggleCheckList: (key: StrategiesFilterConditionKey, value: string) => void;
  setShowStrategyExplanation: (show: boolean) => void;
}

export type Props = StateFromProps & DispatchFromProps;

export default class StrategyFilter extends React.PureComponent<Props> {
  private handleOnChangeValue: <V>(
    itemName: StrategiesFilterConditionKey,
    value: V
  ) => void = (itemName, value): void => {
    this.props.setCondition({ [itemName]: value });
  };

  public render(): React.ReactNode {
    const { searchMode, filterContents, filterCondition, toggleCheckList } =
      this.props;
    const generalModeOff = searchMode !== 'general';
    return (
      <div className={classNames({ 'general-mode-off': generalModeOff })}>
        <section className="filter-section general-mode-only">
          <h2 className="title">計略表示切り替え</h2>
          <SwitchItem<StrategiesFilterConditionKey>
            itemName="showStrategyExplanation"
            onChangeValue={this.handleOnChangeValue}
            isOn={filterCondition.showStrategyExplanation}
            labelOff="計略名"
            labelOn="計略説明"
            width={200}
          />
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">計略名検索</h2>
          <SearchTextBox<StrategiesFilterConditionKey>
            itemName="strategySearchName"
            value={filterCondition.strategySearchName}
            onChangeValue={this.handleOnChangeValue}
          />
          <div>スペース区切りでAND検索 読み仮名(ひらがな、カタカナ)対応</div>
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">計略説明検索</h2>
          <SearchTextBox<StrategiesFilterConditionKey>
            itemName="strategySearchExplanation"
            value={filterCondition.strategySearchExplanation}
            onChangeValue={this.handleOnChangeValue}
          />
          <div>スペース区切りでAND検索</div>
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">計略必要士気</h2>
          <div className="range">
            <NumberSelect<StrategiesFilterConditionKey>
              itemName="moraleMin"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.moraleMin}
              max={12}
              min={1}
            />
            -
            <NumberSelect<StrategiesFilterConditionKey>
              itemName="moraleMax"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.moraleMax}
              max={12}
              min={1}
            />
          </div>
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">計略カテゴリー</h2>
          <StrategyCategoryButtonList
            itemName="strategyCategories"
            items={filterContents.strategyCategories}
            checkedItems={filterCondition.strategyCategories}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">計略効果時間</h2>
          <FilterButtonList<StrategiesFilterConditionKey>
            itemName="strategyTimes"
            items={filterContents.strategyTimes}
            checkedItems={filterCondition.strategyTimes}
            onClickItem={toggleCheckList}
          />
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">計略範囲</h2>
          <StrategyRangeButtonList
            itemName="strategyRanges"
            items={filterContents.strategyRanges}
            checkedItems={filterCondition.strategyRanges}
            onClickItem={toggleCheckList}
          />
        </section>
      </div>
    );
  }
}
