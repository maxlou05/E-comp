import React from 'react';
import ReactDOM from 'react-dom/client';

 export default class Circle extends React.Component {
     render() {
         var strokeWidth = this.props.strokeWidth || 0;
         var r = this.props.r || 0;

         var height = (r * 2) + 2 * strokeWidth;
         var width = (r * 2) + 2 * strokeWidth;

         var cx = r + (strokeWidth / 2);
         var cy = r + (strokeWidth / 2);
         var props = styleSvg(_.omit(this.props, 'style'),this.props);
         return (
             <SVGComponent height={height} width={width}>
                 <circle {...props} cx={cx} cy={cy}>{this.props.children}</circle>
             </SVGComponent>)

     }
 }
