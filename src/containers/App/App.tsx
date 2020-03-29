import './App.css';
import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import type { WindowState, FilterTab } from '../../modules/window';
import { filterTabNames } from '../../modules/window';
import FilterTabs from '../../components/FilterTabs';
import FilterActions from '../../components/FilterActions';
import SideMenu from '../SideMenu';
import DeckBoard from '../DeckBoard';
import CardList from '../CardList';
import AssistCardList from '../AssistCardList';
import SimpleFilter from '../SimpleFilter';
import BaseFilter from '../BaseFilter';
import DetailFilter from '../DetailFilter';
import StrategyFilter from '../StrategyFilter';
import DeckConfig from '../DeckConfig';
import UpdateInfo from '../UpdateInfo';
import GeneralDetail from '../GeneralDetail';
import Dialog from '../Dialog';
import { AprilFoolGeneral } from '3594t-deck';

export interface StateFromProps extends WindowState {
  openedAnyModalSmall: boolean;
  openedAnyModal: boolean;
  showNotice: boolean;
  loading: boolean;
  deckSelected: boolean;
  aprilFoolGeneral: AprilFoolGeneral | null;
}

export interface DispatchFromProps {
  clearActiveCard(): void;
  resetConditions(): void;
  appDidLoaded(): void;
  openSideMenu(): void;
  closeSideMenu(): void;
  openFilter(): void;
  closeFilter(): void;
  closeAllModal(): void;
  changeActiveFilterTab(activeFilter: FilterTab): void;
  disableAprilFool(): void;
}

export type OwnProps = {};

export type Props = StateFromProps & DispatchFromProps & OwnProps;

export default class App extends React.PureComponent<Props> {
  public componentDidMount(): void {
    this.props.appDidLoaded();
  }

  private handleAppClick = () => {
    this.props.clearActiveCard();
    this.props.closeSideMenu();
  };

  private handleSideMenuButtonClick = () => {
    this.props.openSideMenu();
  };

  public render(): React.ReactNode {
    const {
      ready,
      loading,
      resetConditions,
      openedSideMenu,
      openFilter,
      showNotice,
      closeFilter,
      closeAllModal,
      changeActiveFilterTab,
      openedFilter: open,
      openedAnyModal: modal,
      openedAnyModalSmall: modalSmall,
      activeFilter,
      deckSelected,
      aprilFoolGeneral,
      disableAprilFool,
    } = this.props;
    const aprilFool = !!aprilFoolGeneral;
    const stylePurge: React.CSSProperties = {
      display: 'none',
    };
    if (aprilFool) {
      stylePurge.display = 'block';
      stylePurge.position = 'fixed';
      stylePurge.top = '40px';
      stylePurge.left = '80px';
      stylePurge.fontSize = '20px';
    }
    return (
      <div
        className={classNames([
          'app-container',
          {
            modal,
            'modal-small': modalSmall,
            ready,
            'deck-selected': deckSelected,
          },
        ])}
        onClick={this.handleAppClick}
      >
        <div className={classNames('side-menu', { open: openedSideMenu })}>
          <div className="side-menu-header" />
          <SideMenu />
          &copy;SEGA
        </div>
        <div className="app-main">
          <div className="app-deck-block">
            <div className="app-header">
              <button
                className={classNames('side-menu-button', {
                  show: !openedSideMenu,
                })}
                onClick={this.handleSideMenuButtonClick}
              >
                <FontAwesomeIcon icon={faBars} />
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className={classNames('notice', {
                    show: showNotice,
                  })}
                />
              </button>
              <div className="app-header-title">
                三国志大戦デッキシミュレーター
              </div>
            </div>
            <div className="deck-boad-container">
              <DeckBoard />
            </div>
            <div className="simple-filter-container">
              <SimpleFilter />
              <button className="open-filter" onClick={openFilter}>
                絞込
              </button>
            </div>
            <CardList />
            <AssistCardList />
          </div>
          <div className={classNames(['card-filter-container', { open }])}>
            <h1 className="card-filter-title">絞り込みメニュー</h1>
            <div className="card-filter-buttons">
              <FilterTabs
                tabs={filterTabNames}
                activeTab={activeFilter}
                onTabChanged={changeActiveFilterTab}
              />
              <FilterActions
                resetConditions={resetConditions}
                closeFilter={closeFilter}
              />
            </div>
            <div
              className={classNames([
                'card-filter-content',
                { active: activeFilter === 'BASIC' },
              ])}
            >
              <BaseFilter />
            </div>
            <div
              className={classNames([
                'card-filter-content',
                { active: activeFilter === 'DETAIL' },
              ])}
            >
              <DetailFilter />
            </div>
            <div
              className={classNames([
                'card-filter-content',
                { active: activeFilter === 'STRAT' },
              ])}
            >
              <StrategyFilter />
            </div>
          </div>
        </div>
        <button style={stylePurge} onClick={disableAprilFool}>
          浄化する
        </button>
        <div className="modal-background" onClick={closeAllModal} />
        <GeneralDetail />
        <DeckConfig />
        <UpdateInfo />
        <div className={classNames('loading-item', { loading })} />
        <Dialog />
      </div>
    );
  }
}
