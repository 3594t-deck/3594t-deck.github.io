import './BaseFilter.css';
import React from 'react';
import classNames from 'classnames';
import type { FilterContents, SearchMode } from '3594t-deck';
import {
  MIN_FORCE,
  MAX_FORCE,
  MIN_INTELIGENCE,
  MAX_INTELIGENCE,
  MIN_CONQUEST,
  MAX_CONQUEST,
} from '../../const';
import type {
  BasicFilterCondition,
  BasicFilterConditionKey,
} from '../../modules/datalist';
import FilterButtonList from '../../components/FilterButtonList';
import SkillButtonList from '../../components/SkillButtonList';
import SwitchItem from '../../components/SwitchItem';
import NumberSelect from '../../components/NumberSelect';
import CostRatioBaseForce from '../../components/CostRatioBaseForce';
import SearchTextBox from '../../components/SearchTextBox';

export interface StateFromProps {
  searchMode: SearchMode;
  filterCondition: BasicFilterCondition;
  filterContents: FilterContents;
  searchByDeckBelongState: boolean;
  searchByDeckCost: boolean;
  searchByDeckUnitType: boolean;
  exchangeForceIntelligence: boolean;
}

export interface DispatchFromProps {
  setSearchMode: (searchMode: SearchMode) => void;
  setCondition: (condition: Partial<BasicFilterCondition>) => void;
  toggleCheckList: (key: BasicFilterConditionKey, value: string) => void;
}

export type Props = StateFromProps & DispatchFromProps;

export default class BaseFilter extends React.PureComponent<Props> {
  private handleOnChangeSearchMode: (_: 'searchMode', value: boolean) => void =
    (_, value): void => {
      this.props.setSearchMode(value ? 'assist' : 'general');
    };

  private handleOnChangeValue: <V>(
    itemName: BasicFilterConditionKey,
    value: V
  ) => void = (itemName, value): void => {
    this.props.setCondition({ [itemName]: value });
  };

  public render(): React.ReactNode {
    const {
      searchMode,
      filterContents,
      filterCondition,
      searchByDeckBelongState,
      searchByDeckCost,
      searchByDeckUnitType,
      exchangeForceIntelligence,
      setCondition,
      toggleCheckList,
    } = this.props;
    const generalModeOff = searchMode !== 'general';
    const intelligenceElm = (
      <section className="filter-section general-mode-only">
        <h2 className="title">{exchangeForceIntelligence ? '武力' : '知力'}</h2>
        <div className="range">
          <NumberSelect<BasicFilterConditionKey>
            itemName="intelligenceMin"
            onChangeValue={this.handleOnChangeValue}
            value={filterCondition.intelligenceMin}
            max={MAX_INTELIGENCE}
            min={MIN_INTELIGENCE}
          />
          -
          <NumberSelect<BasicFilterConditionKey>
            itemName="intelligenceMax"
            onChangeValue={this.handleOnChangeValue}
            value={filterCondition.intelligenceMax}
            max={MAX_INTELIGENCE}
            min={MIN_INTELIGENCE}
          />
        </div>
      </section>
    );
    return (
      <div className={classNames({ 'general-mode-off': generalModeOff })}>
        <section className="filter-section">
          <h2 className="title">武将/遊軍切り替え</h2>
          <SwitchItem<'searchMode'>
            itemName="searchMode"
            onChangeValue={this.handleOnChangeSearchMode}
            isOn={generalModeOff}
            labelOff="武将"
            labelOn="遊軍"
            width={160}
          />
        </section>
        <section className="filter-section">
          <h2 className="title">勢力</h2>
          <FilterButtonList<BasicFilterConditionKey>
            itemName="belongStates"
            items={filterContents.belongStates}
            checkedItems={filterCondition.belongStates}
            onClickItem={toggleCheckList}
            square={true}
            disabled={searchByDeckBelongState}
          />
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">コスト</h2>
          <FilterButtonList<BasicFilterConditionKey>
            itemName="costs"
            items={filterContents.costs}
            checkedItems={filterCondition.costs}
            onClickItem={toggleCheckList}
            square={true}
            disabled={searchByDeckCost}
          />
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">兵種</h2>
          <FilterButtonList<BasicFilterConditionKey>
            itemName="unitTypes"
            items={filterContents.unitTypes}
            checkedItems={filterCondition.unitTypes}
            onClickItem={toggleCheckList}
            square={true}
            disabled={searchByDeckUnitType}
          />
        </section>
        {exchangeForceIntelligence ? intelligenceElm : <></>}
        <section className="filter-section general-mode-only">
          <h2 className="title">
            {exchangeForceIntelligence ? '知力' : '武力'}
          </h2>
          <div className="title-button">
            <SwitchItem<BasicFilterConditionKey>
              itemName="useCostRatioForce"
              onChangeValue={this.handleOnChangeValue}
              isOn={filterCondition.useCostRatioForce}
              labelOff="通常"
              labelOn="コスト比"
              width={180}
            />
          </div>
          <div
            className={classNames('normal-force', {
              active: !filterCondition.useCostRatioForce,
            })}
          >
            <div className="range">
              <NumberSelect<BasicFilterConditionKey>
                itemName="forceMin"
                onChangeValue={this.handleOnChangeValue}
                value={filterCondition.forceMin}
                max={MAX_FORCE}
                min={MIN_FORCE}
              />
              -
              <NumberSelect<BasicFilterConditionKey>
                itemName="forceMax"
                onChangeValue={this.handleOnChangeValue}
                value={filterCondition.forceMax}
                max={MAX_FORCE}
                min={MIN_FORCE}
              />
            </div>
          </div>
          <div
            className={classNames('cost-ratio-force', {
              active: filterCondition.useCostRatioForce,
            })}
          >
            <div className="range">
              <NumberSelect<BasicFilterConditionKey>
                itemName="costRatioForceMin"
                onChangeValue={this.handleOnChangeValue}
                value={filterCondition.costRatioForceMin}
                max={5}
                min={-5}
              />
              以上
            </div>
            <CostRatioBaseForce
              costRatioBaseForces={filterCondition.costRatioBaseForces}
              exchangeForceIntelligence={exchangeForceIntelligence}
              setCondition={setCondition}
            />
          </div>
        </section>
        {exchangeForceIntelligence ? <></> : intelligenceElm}
        <section className="filter-section general-mode-only">
          <h2 className="title">征圧力</h2>
          <div className="range">
            <NumberSelect<BasicFilterConditionKey>
              itemName="conquestMin"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.conquestMin}
              max={MAX_CONQUEST}
              min={MIN_CONQUEST}
            />
            -
            <NumberSelect<BasicFilterConditionKey>
              itemName="conquestMax"
              onChangeValue={this.handleOnChangeValue}
              value={filterCondition.conquestMax}
              max={MAX_CONQUEST}
              min={MIN_CONQUEST}
            />
          </div>
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">特技</h2>
          <div className="title-button">
            <SwitchItem<BasicFilterConditionKey>
              itemName="skillsAnd"
              onChangeValue={this.handleOnChangeValue}
              isOn={filterCondition.skillsAnd}
              labelOff="OR"
              labelOn="AND"
            />
          </div>
          <SkillButtonList
            itemName="skills"
            items={filterContents.skills}
            checkedItems={filterCondition.skills}
            onClickItem={toggleCheckList}
            square={true}
          />
        </section>
        <section className="filter-section general-mode-only">
          <h2 className="title">武将名検索</h2>
          <SearchTextBox<BasicFilterConditionKey>
            itemName="searchText"
            value={filterCondition.searchText}
            onChangeValue={this.handleOnChangeValue}
          />
          <div>スペース区切りでOR検索 読み仮名(ひらがな、カタカナ)対応</div>
        </section>
      </div>
    );
  }
}
