import './StrategyRangeButtonList.css';
import React from 'react';
import classNames from 'classnames';
import type { ButtonItem } from '3594t-deck';
import FilterButtonList from '../FilterButtonList';
import { strategyRangeImageUrl } from '../../utils/externalUrl';

export default class StrategyRangeButtonList extends FilterButtonList<'strategyRanges'> {
  protected createLabel(item: ButtonItem): React.ReactNode | React.ReactNode[] {
    if (item.code == null) {
      return '';
    }
    const src = strategyRangeImageUrl(item.code);
    return <img className="range-image" src={src} />;
  }

  protected createButton(
    value: string,
    label: React.ReactNode | React.ReactNode[],
    style: React.CSSProperties,
    disabled: boolean,
    className: string
  ): JSX.Element {
    return super.createButton(
      value,
      label,
      style,
      disabled,
      classNames(className, 'strategy-range-button')
    );
  }
}
