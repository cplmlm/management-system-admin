import{r as s,bk as u,j as a,bl as p,e as x}from"./index-Da2ZG1xd.js";import{R as f}from"./index-Byowdsde.js";import{C as m,a as j,P as R}from"./ConclusionAdvice-VrjuOvrc.js";const P=o=>{const[t,r]=s.useState("");s.useEffect(()=>{var n;i({key:(n=o.data)==null?void 0:n.id},o.data)},[]);const i=async(n,c)=>{var l;let e=await u(n);if((e==null?void 0:e.status)===200){const d=Object.assign({},{reportDate:(l=e==null?void 0:e.data)==null?void 0:l.createTime},c,e==null?void 0:e.data);r(d)}};return a.jsxs("div",{children:[t!==""?a.jsx(m,{data:t}):null,t!==""?a.jsx(j,{data:t}):null,t!==""?a.jsx(R,{data:t}):null]})},C=o=>{const[t,r]=s.useState([]),i=s.useRef(null);return s.useEffect(()=>{r(o.data)},[]),a.jsxs("div",{children:[a.jsx("div",{className:p.printerOutlined,children:a.jsx(f,{trigger:()=>x("PrinterOutlined","#000",25),content:()=>i.current})}),a.jsx("div",{ref:i,id:"popupContentRef",children:t==null?void 0:t.map((n,c)=>a.jsx(P,{data:n}))})]})};export{C as default};