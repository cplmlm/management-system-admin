import{r as n,F as l,s as w,aD as N,aE as F,j as s,R as C,C as d,I as c}from"./index-Da2ZG1xd.js";import{T as S}from"./index-5IsStPVA.js";const M=t=>{n.useImperativeHandle(t.onRef,()=>({confirm:g}));const[i]=l.useForm(),[o,x]=w.useMessage(),[u,m]=n.useState(""),[r,j]=n.useState(""),[p,h]=n.useState(0);n.useEffect(()=>{f(),I()},[]);const f=()=>{const e=t.data;console.log(e),j(e.parentId),e.id!==void 0&&e.id!==null&&e.id!==""?(m(e.id),i.setFieldsValue(e)):m("")},I=()=>{t.data.parentId==="0"?(i.setFieldsValue({value:"-",code:"-",description:"-"}),h(1)):h(2)},g=()=>{i.validateFields().then(e=>{u!==""?(e.id=u,b(e)):(e.parentId=r,y(e))}).catch(e=>{})},y=async e=>{t.setLoading(!0);let a=await N(e);(a==null?void 0:a.status)===200&&(o.success(a.message),t.closeModal(p)),t.setLoading(!1)},b=async e=>{let a=await F(e);(a==null?void 0:a.status)===200&&(o.success(a.message),t.closeModal(p))};return s.jsxs("div",{className:"form-content",children:[x,s.jsx(l,{form:i,labelCol:{span:6},children:s.jsxs(C,{children:[s.jsx(d,{span:24,children:s.jsx(l.Item,{label:"序号",name:"serialNumber",rules:[{required:!0,message:"序号不能为空"}],children:s.jsx(S,{className:"input-width",placeholder:"请输入",min:0})})}),s.jsx(d,{span:24,children:s.jsx(l.Item,{label:"参数名称",name:"name",rules:[{required:!0,message:"项目名称不能为空"}],children:s.jsx(c,{className:"input-width",placeholder:"请输入"})})}),s.jsx(d,{span:24,style:{display:r==="0"?"none":"block"},children:s.jsx(l.Item,{label:"参数编码",name:"code",rules:[{required:!0,message:"参数编码不能为空"}],children:s.jsx(c,{className:"input-width",placeholder:"请输入"})})}),s.jsx(d,{span:24,style:{display:r==="0"?"none":"block"},children:s.jsx(l.Item,{label:"参数值",name:"value",rules:[{required:!0,message:"参数值不能为空"}],children:s.jsx(c,{className:"input-width",placeholder:"请输入"})})}),s.jsx(d,{span:24,style:{display:r==="0"?"none":"block"},children:s.jsx(l.Item,{label:"参数说明",name:"description",rules:[{required:!0,message:"参数说明不能为空"}],children:s.jsx(c,{className:"input-width",placeholder:"请输入"})})})]})})]})};export{M as default};