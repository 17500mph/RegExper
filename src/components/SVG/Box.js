import React from 'react';
import PropTypes from 'prop-types';

import style from './style';

import reflowable from './reflowable';

@reflowable
class Box extends React.PureComponent {
  static defaultProps = {
    padding: 5,
    radius: 3
  }

  label = React.createRef()

  children = [React.createRef()]

  reflow() {
    const { padding, useAnchors } = this.props;
    const box = this.children[0].current.getBBox();
    const labelBox = this.label.current ? this.label.current.getBBox() : { width: 0, height: 0};

    this.setBBox({
      width: Math.max(box.width + 2 * padding, labelBox.width),
      height: box.height + 2 * padding + labelBox.height,
      axisY: (useAnchors ? box.axisY : box.height / 2) + padding + labelBox.height,
      axisX1: useAnchors ? box.axisX1 + padding : 0,
      axisX2: useAnchors ? box.axisX2 + padding : box.width + 2 * padding
    });

    this.setStateAsync({
      width: this.getBBox().width,
      height: box.height + 2 * padding,
      contentTransform: `translate(${ padding } ${ padding + labelBox.height })`,
      rectTransform: `translate(0 ${ labelBox.height })`,
      labelTransform: `translate(0 ${ labelBox.height })`
    });
  }

  render() {
    const { theme, radius, label, children } = this.props;
    const { width, height, labelTransform, rectTransform, contentTransform } = this.state || {};

    const rectProps = {
      style: style[theme],
      width,
      height,
      rx: radius,
      ry: radius,
      transform: rectTransform
    };
    const textProps = {
      transform: labelTransform,
      style: style.infoText,
      ref: this.label
    };

    return <React.Fragment>
      <rect { ...rectProps } ></rect>
      { label && <text { ...textProps }>{ label }</text> }
      <g transform={ contentTransform }>
        { React.cloneElement(React.Children.only(children), {
          ref: this.children[0]
        }) }
      </g>
    </React.Fragment>;
  }
}

Box.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  padding: PropTypes.number,
  useAnchors: PropTypes.bool,
  radius: PropTypes.number,
  theme: PropTypes.string
};

export default Box;