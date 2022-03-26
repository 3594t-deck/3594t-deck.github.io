import './StrategyCategoryButtonList.css';
import React from 'react';
import classNames from 'classnames';
import FilterButtonList from '../FilterButtonList';

const BRACKET_END = '】';

export default class StrategyCategoryButtonList extends FilterButtonList<'strategyCategories'> {
  protected createButton(
    value: string,
    label: React.ReactNode | React.ReactNode[],
    style: React.CSSProperties,
    disabled: boolean,
    className: string
  ): JSX.Element {
    if (typeof label !== 'string' || !label.includes(BRACKET_END)) {
      return super.createButton(
        value,
        label,
        style,
        disabled,
        classNames(className, 'strategy-category-button')
      );
    }
    const multiLineLabels: React.ReactNode[] = [];
    const splitedLabels = label.split(BRACKET_END);
    splitedLabels.forEach((l, i) => {
      const isLast = i === splitedLabels.length - 1;
      if (isLast) {
        multiLineLabels.push(
          <span className="main-name" key={i}>
            {l}
          </span>
        );
      } else {
        multiLineLabels.push(
          <span className="sub-name" key={i}>
            {l + BRACKET_END}
          </span>
        );
      }
    });
    // 【】対応
    return super.createButton(
      value,
      multiLineLabels,
      style,
      disabled,
      classNames(className, 'multiline-label', 'strategy-category-button')
    );
  }
}
