import{r as t,bk as m,j as e,bl as l,bm as x,A as u,z as S,e as a}from"./index-Da2ZG1xd.js";import{R as N}from"./index-Byowdsde.js";const g=r=>{const[s,h]=t.useState({});t.useEffect(()=>{var n;console.log(r.data),j({key:(n=r.data)==null?void 0:n.id},r.data)},[]);const j=async(n,i)=>{var d;let c=await m(n);if((c==null?void 0:c.status)===200){const p=Object.assign({},{reportDate:(d=c==null?void 0:c.data)==null?void 0:d.createTime},i,c==null?void 0:c.data);h(p)}},o=(n,i)=>n!=null&&i!==void 0&&i!==null?n+"/"+i:"";return e.jsxs("div",{className:l.printReportPage,children:[e.jsx("div",{className:l.title,children:"成都市中小学在校学生健康检查表"}),e.jsx("div",{className:l.reportDate,children:x(s==null?void 0:s.reportDate)}),e.jsx("table",{className:l.tableBorder,children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsxs("td",{colSpan:4,className:l.tableResult,children:["学校名称：",s==null?void 0:s.schoolName]}),e.jsxs("td",{colSpan:6,className:l.tableResult,children:["学校所在地：",s==null?void 0:s.schoolAddress]})]}),e.jsxs("tr",{children:[e.jsxs("td",{colSpan:4,className:l.tableResult,children:["学校类别：",(s==null?void 0:s.type)===1?"城":"乡"]}),e.jsxs("td",{colSpan:6,className:l.tableResult,children:["身份证号码：",s==null?void 0:s.idNumber]})]}),e.jsxs("tr",{children:[e.jsxs("td",{colSpan:2,className:l.tableResult,children:["年级：",u(s==null?void 0:s.grade)]}),e.jsxs("td",{colSpan:2,className:l.tableResult,children:["班级：",(s==null?void 0:s.classGroup)!==null&&(s==null?void 0:s.classGroup)!==void 0?(s==null?void 0:s.classGroup)+"班":""]}),e.jsxs("td",{colSpan:6,className:l.tableResult,children:["家庭地址：",s==null?void 0:s.address]})]}),e.jsxs("tr",{children:[e.jsxs("td",{colSpan:2,className:l.tableResult,children:["姓名：",s==null?void 0:s.name]}),e.jsxs("td",{colSpan:2,className:l.tableResult,children:["性别：",S(s==null?void 0:s.gender)]}),e.jsxs("td",{colSpan:6,className:l.tableResult,children:["出生日期：",x(s==null?void 0:s.birthdate)]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"既往病史"}),e.jsx("td",{colSpan:7,className:l.tableResult,children:s==null?void 0:s.pastMedicalHistory}),e.jsx("td",{children:e.jsx("img",{className:l.sign,src:s==null?void 0:s.pastMedicalHistoryDoctorSign})})]}),e.jsxs("tr",{children:[e.jsx("td",{rowSpan:2,children:"一般情况"}),e.jsxs("td",{colSpan:3,className:l.tableResult,children:["血压：",o(s==null?void 0:s.systolicBloodPressure,s==null?void 0:s.diastolicBloodPressure),"mmH "]}),e.jsxs("td",{colSpan:2,className:l.tableResult,children:["脉搏：",s==null?void 0:s.pulse,"次/分"]}),e.jsxs("td",{colSpan:2,className:l.tableResult,children:["肺活量：",s==null?void 0:s.vitalCapacity,"ml"]}),e.jsx("td",{rowSpan:2,children:e.jsx("img",{className:l.sign,src:s==null?void 0:s.generalConditionDoctorSign})})]}),e.jsxs("tr",{children:[e.jsxs("td",{colSpan:3,className:l.tableResult,children:["体重：",s==null?void 0:s.weight,"kg "]}),e.jsxs("td",{colSpan:2,className:l.tableResult,children:["身高：",s==null?void 0:s.height,"cm"]}),e.jsxs("td",{colSpan:2,className:l.tableResult,children:["BMI：",s==null?void 0:s.bmi,"kg/m²"]})]}),e.jsxs("tr",{children:[e.jsx("td",{rowSpan:4,children:"内科"}),e.jsx("td",{children:"心"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.heart}),e.jsx("td",{rowSpan:4,children:e.jsx("img",{className:l.sign,src:s==null?void 0:s.internalMedicineDoctorSign})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"肺"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.lungs})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"肝"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.liver})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"脾"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.spleen})]}),e.jsxs("tr",{children:[e.jsx("td",{rowSpan:7,children:"外科"}),e.jsx("td",{children:" 头部"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.head}),e.jsx("td",{rowSpan:7,children:e.jsx("img",{className:l.sign,src:s==null?void 0:s.surgeryDoctorSign})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"颈部"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.neck})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"胸部"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.chest})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"脊柱"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.spine})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"四肢关节"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.limbJoint})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"皮肤"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.skin})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"淋巴结"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.lymphNode})]}),e.jsxs("tr",{children:[e.jsx("td",{rowSpan:4,children:"五官科"}),e.jsx("td",{children:" 裸眼视力"}),e.jsxs("td",{colSpan:3,className:l.tableResult,children:[" 左：",s==null?void 0:s.uncorrectedVisualAcuityLeft,"   右：",s==null?void 0:s.uncorrectedVisualAcuityRight]}),e.jsx("td",{children:" 矫正视力"}),e.jsxs("td",{colSpan:2,className:l.tableResult,children:[" 左：",s==null?void 0:s.correctedVisualAcuityLeft,"   右：",s==null?void 0:s.correctedVisualAcuityRight]}),e.jsx("td",{rowSpan:4,children:e.jsx("img",{className:l.sign,src:s==null?void 0:s.otolaryngologyDoctorSign})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"沙眼"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.trachoma})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"结膜炎"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.conjunctivitis})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"耳鼻喉"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.ent})]}),e.jsxs("tr",{children:[e.jsx("td",{rowSpan:5,children:"口腔科"}),e.jsx("td",{rowSpan:4,children:"龋齿"}),e.jsxs("td",{colSpan:3,children:[s==null?void 0:s.dentalCavityTopLeft," "]}),e.jsxs("td",{colSpan:3,children:[s==null?void 0:s.dentalCavityTopRight," "]}),e.jsx("td",{rowSpan:5,children:e.jsx("img",{className:l.sign,src:s==null?void 0:s.dentistryDoctorSign})})]}),e.jsxs("tr",{children:[e.jsxs("td",{colSpan:3,children:[s==null?void 0:s.dentalCavityLowerLeft," "]}),e.jsxs("td",{colSpan:3,children:[s==null?void 0:s.dentalCavityLowerRight," "]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"d"}),e.jsx("td",{children:"m"}),e.jsx("td",{children:"f"}),e.jsx("td",{children:"D"}),e.jsx("td",{children:"M"}),e.jsx("td",{children:"F"})]}),e.jsxs("tr",{children:[e.jsxs("td",{children:[s==null?void 0:s.lowercaseD," "]}),e.jsx("td",{children:s==null?void 0:s.lowercaseM}),e.jsx("td",{children:s==null?void 0:s.lowercaseF}),e.jsx("td",{children:s==null?void 0:s.capitalizedD}),e.jsx("td",{children:s==null?void 0:s.capitalizedM}),e.jsx("td",{children:s==null?void 0:s.capitalizedF})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"牙周组织"}),e.jsx("td",{colSpan:6,className:l.tableResult,children:s==null?void 0:s.periodontalTissues})]}),e.jsxs("tr",{children:[e.jsx("td",{rowSpan:10,children:"辅助检查"}),e.jsx("td",{children:"结核菌素（新生）"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"}),e.jsx("td",{rowSpan:10})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"血常规*"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"尿常规*"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"谷丙转氨酶*"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"胆红素*"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"腹部黑白B超*"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"心电图*"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"血红蛋白*"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"蛔虫卵*"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"其他检查*"}),e.jsx("td",{colSpan:6,children:"检查结果（附检查单）"})]}),e.jsxs("tr",{children:[e.jsxs("td",{colSpan:6,className:l.tableResult,children:["体检结论：",s==null?void 0:s.conclusion]}),e.jsxs("td",{style:{verticalAlign:"top"},children:[e.jsx("p",{children:"总检医生"}),e.jsx("img",{className:l.sign,src:s==null?void 0:s.conclusionDoctorSign})]}),e.jsxs("td",{colSpan:2,style:{verticalAlign:"top"},children:[e.jsx("p",{children:"体检机构签章"}),s==null?void 0:s.organizationName]})]})]})}),e.jsxs("div",{className:l.tipsFirst,children:["注意：1.* 是可选择检查项目；",e.jsx("br",{})]}),e.jsxs("div",{className:l.tipsThird,children:[" 2.结核病检查按照《成都市卫生和计划生育委员会 成都市教育局关于贯彻落实","<","学校结核病防控工作规范（2017版）",">","的通知》（成卫计发〔2017〕61号）规定执行"]})]})},y=r=>{const s=t.useRef(null);return e.jsxs("div",{children:[e.jsx("div",{className:l.printerOutlined,children:e.jsx(N,{trigger:()=>a("PrinterOutlined","#000",25),content:()=>s.current})}),e.jsx("div",{ref:s,id:"popupContentRef",children:e.jsx(g,{data:r.data})})]})};export{y as default};