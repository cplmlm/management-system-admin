import React, { useEffect, useRef, useState } from 'react'
import successIcon from './img/success-fill.svg'
import rightIcon from './img/arrow-right.svg'
import './index.less'

let beginClientX = 0 // 距离屏幕左端距离
let mouseMoveStata = false // 触发拖动状态判断
let maxwidth = "" // 拖动最大宽度，依据滑块宽度算出来的
let count = 0
let htmlDom = null
let confirmSuccess = false

const Page = (props) => {
  const {
    width = '300px',
    height = '34px',
    defaultBg = '#e8e8e8',
    defaultText = '请按住滑块，拖动到最右边',
    loadingText = '验证中',
    successBg = '#7ac23c111',
    successText = '验证通过',
    onSuccess = (e) => { console.log('前端滑动验证通过时会触发该回调参数。您可以在该回调参数中将会话ID（sessionId）、签名串（sig）、请求唯一标识（token）字段记录下来，随业务请求一同发送至您的服务端调用验签。', e) },
    onFail = (e) => { console.log('滑动验证失败时触发该回调参数。', e) },
    onError = (e) => { console.log('验证码加载出现异常时触发该回调参数。', e) },
    reqCode = async () => {
      // const res = await false // 返回失败情况
      // const res = await fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/diamond.json') // 返回成功
      // return res
      const res = await 'lkjsafdsafsaf'
      return res
    }
  } = props

  const [confirmWords, setConfirmWords] = useState(defaultText)
  const [success, setSuccess] = useState(false)
  const dragDiv = useRef()
  const moveDiv = useRef()
  const dragText = useRef()
  const dragBg = useRef()

  const mousedownFn = (e) => {
    if (!confirmSuccess) {
      e.preventDefault && e.preventDefault(); //阻止文字选中等 浏览器默认事件
      mouseMoveStata = true;
      beginClientX = e.clientX;
    }
  }
  const slidePos = (val) => {
    if (moveDiv.current) {
      moveDiv.current.style.left = val + "px";
    }
    if (dragBg.current) {
      dragBg.current.style.width = val + "px";
    }
  }
  const clearBatchEvent = () => {
    if (window.addEventListener) {
      htmlDom.removeEventListener("mousemove", mouseMoveFn);
      htmlDom.removeEventListener("mouseup", moseUpFn);
    } else {
      htmlDom.removeEventListener("mouseup", () => { });
    }
  }
  // mousedoen 事件
  const successFunction = (res) => {
    confirmSuccess = true
    setSuccess(true)
    setConfirmWords(successText)
    clearBatchEvent()
    dragText.current.style['-webkit-text-fill-color'] = "#fff";
    dragText.current.style['margin-left'] = "-40px";
    slidePos(maxwidth)
    onSuccess(res)
  }
  // 验证成功函数
  const mouseMoveFn = (e) => {
    if (mouseMoveStata) {
      let width = e.clientX - beginClientX;
      if (width > 0 && width <= maxwidth) {
        slidePos(width)
      } else if (width > maxwidth) {
        if (count === 0) {
          count++
          setConfirmWords(loadingText)
          reqCode().then(res => {
            if (res) {
              successFunction(res);
            } else {
              setTimeout(() => {
                slidePos(0)
                count = 0
                setConfirmWords(defaultText)
                onFail(res)
              }, 500);
            }
          }).catch(err => {
            onError(err)
          })
        }
      }
    }
  }
  // mousemove事件
  const moseUpFn = (e) => {
    mouseMoveStata = false;
    var width = e.clientX - beginClientX;
    if (width < maxwidth) {
      slidePos(0)
    }
  }
  // mouseup事件
  useEffect(() => {
    maxwidth = dragDiv.current.clientWidth - moveDiv.current.clientWidth;
    htmlDom = document.getElementsByTagName("html")[0]
    htmlDom.addEventListener("mousemove", mouseMoveFn);
    htmlDom.addEventListener("mouseup", moseUpFn);
    return () => {
      beginClientX = 0 // 距离屏幕左端距离
      mouseMoveStata = false // 触发拖动状态判断
      confirmSuccess = false
      count = 0
      clearBatchEvent()
    }
  }, [])

  return (
    <div className='slide-verify' ref={dragDiv} style={{ height, width, lineHeight: height, background: defaultBg }}>
      <div className='drag-bg' ref={dragBg} style={{ background: confirmWords === successText && successBg }}></div>
      <div className='drag-text'>
        <span className='text-name' ref={dragText}>{confirmWords}</span>
      </div>
      <div ref={moveDiv} onMouseDown={mousedownFn} className='handler handler-bg'>
        <img className='slide-icon' src={success ? successIcon : rightIcon} />
      </div>
    </div>
  )
};

export default Page
