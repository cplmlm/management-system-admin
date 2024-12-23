// import { useEffect, useRef } from "react";
// import JsBarcode from 'jsbarcode'

// const Barcode = (props) => {
//     const barcodeRef = useRef(null); // 使用 useRef 来获取DOM元素的引用

//     useEffect(() => {
//         // 使用 useEffect 来替代 componentDidMount
//         JsBarcode(barcodeRef.current, props.value, {
//             displayValue: true,
//             width: 1.3,
//             height: 35,
//             margin: 0,
//         });
//     }, []);


//     return (
//         <svg
//             ref={barcodeRef} // 将 ref 赋值给上面创建的 useRef 引用
//         />
//     )
// }

// export default Barcode

import React, { Component } from 'react';
import  JsBarcode from 'jsbarcode';

/**
 * 简单生成条形码
 * {
 * width: 2,//较细处条形码的宽度
 * height: 100, //条形码的宽度，无高度直接设置项，由位数决定，可以通过CSS去调整，见下
 * quite: 10,
 * format: "CODE128",
 * displayValue: false,//是否在条形码下方显示文字
 * font:"monospace",
 * textAlign:"center",
 * fontSize: 12,
 * backgroundColor:"",
 * lineColor:"#000"//条形码颜色
 * }
 */
class Barcode extends Component {
    componentDidMount() {
        this.createBarcode();
    }

    componentDidUpdate() {
        // if (this.props !== nextProps) {
        this.createBarcode();
        // }
    }

    createBarcode = () => {
        if (!this.barcode) return;
        const {
            width = 1, height = 35, margin = 0, label, displayValue = true,
        } = this.props;
        if (!label) {
            return;
        }
        JsBarcode(this.barcode, label, {
            displayValue,
            width,
            height,
            margin,
        });
    };

    render() {
        const {
            labelClassName, label, labelStyle, className, style, displayValue = true,
        } = this.props;
        return (
            <div className={className} style={style}>
                <svg
                    ref={(ref) => {
                        this.barcode = ref;
                    }}
                />
                {displayValue ? null : <p className={labelClassName} style={labelStyle}>{label}</p>}
            </div>
        );
    }
}

export default Barcode;

