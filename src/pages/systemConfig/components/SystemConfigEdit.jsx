import { Row, Col, Form, Input, message, InputNumber } from "antd";
import { useState, useEffect, useImperativeHandle } from "react";
import { addSystemConfig, updateSystemConfig } from "@/api/systemConfig";

const SystemConfigEdit = (props) => {
  //使用useImperativeHandle向父组件暴露子组件的方法
  useImperativeHandle(props.onRef, () => ({
    confirm // 将子组件的confirm方法暴露给父组件
  }));
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState("");
  const [parentId, setParentId] = useState("");
  const [type, setType] = useState(0)//1-系统模块 2-系统参数

  useEffect(() => {
    init();
    setFormValue()
  }, []);
  //初始化
  const init = () => {
    const data = props.data
    console.log(data)
    setParentId(data.parentId)
    if (data.id !== undefined && data.id !== null && data.id !== "") {
      setId(data.id);
      form.setFieldsValue(data);
    } else {
      setId("");
    }
  }
  //设置表单值
  const setFormValue = () => {
    const data = props.data
    if (data.parentId === "0") {
      form.setFieldsValue({
        value: "-",
        code: "-",
        description: "-"
      });
      setType(1)
    } else {
      setType(2)
    }
  }
  //确定按钮事件
  const confirm = () => {
    form.validateFields().then((values) => {
      if (id !== "") {
        values.id = id
        update(values)
      } else {
        values.parentId = parentId
        add(values)
      }
    }).catch((errorInfo) => {
    });
  }
  //新增
  const add = async (data) => {
    props.setLoading(true)
    let res = await addSystemConfig(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(type)
    }
    props.setLoading(false)
  }
  //修改
  const update = async (data) => {
    let res = await updateSystemConfig(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(type)
    }
  }
  return (
    <div className="form-content">
      {contextHolder}
      <Form
        form={form}
        labelCol={{
          span: 6
        }}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label='序号'
              name='serialNumber'
              rules={[{ required: true, message: '序号不能为空' }]}
            >
              <InputNumber
                className='input-width'
                placeholder='请输入'
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label='参数名称'
              name='name'
              rules={[{ required: true, message: '项目名称不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ display: parentId === "0" ? 'none' : 'block' }}>
            <Form.Item
              label='参数编码'
              name='code'
              rules={[{ required: true, message: '参数编码不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ display: parentId === "0" ? 'none' : 'block' }}>
            <Form.Item
              label='参数值'
              name='value'
              rules={[{ required: true, message: '参数值不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ display: parentId === "0" ? 'none' : 'block' }}>
            <Form.Item
              label='参数说明'
              name='description'
              rules={[{ required: true, message: '参数说明不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
        </Row>
      </Form >
    </div >
  )
}

export default SystemConfigEdit
