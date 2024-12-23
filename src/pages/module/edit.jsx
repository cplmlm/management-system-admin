import { Row, Col, Form, Input, message, Radio } from "antd";
import { useState, useEffect, useImperativeHandle } from "react";
import { addModule, updateModule } from "@/api/module";


const ModuleEdit = (props) => {
  //使用useImperativeHandle向父组件暴露子组件的方法
  useImperativeHandle(props.onRef, () => ({
    confirm // 将子组件的confirm方法暴露给父组件
  }));
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState('');

  useEffect(() => {
    init();
    form.setFieldsValue({ enabled: true })
  }, []);
  //初始化
  const init = () => {
    const data = props.data
    if (data.id !== undefined && data.id !== null && data.id !== '') {
      setId(data.id);
      form.setFieldsValue(data);
    } else {
      setId('');
    }
  }
  //确定按钮事件
  const confirm = () => {
    form.validateFields().then((values) => {
      if (id !== '') {
        values.id = id
        update(values)
      } else {
        add(values)
      }
    }).catch((errorInfo) => {

    });
  }
  //新增
  const add = async (data) => {
    props.setLoading(true)
    let res = await addModule(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(1)
    }
    props.setLoading(false)
  }
  //修改
  const update = async (data) => {
    let res = await updateModule(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(2)
    }
  }

  return (
    <div className="form-content">
      {contextHolder}
      <Form
        form={form}
        labelCol={{span: 6}}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label='接口地址'
              name='linkUrl'
              rules={[{ required: true, message: '接口地址不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="接口名称"
              name="name"
              rules={[{ required: true, message: '接口名称不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label='状态'
              name='enabled'
              rules={[{ required: true, message: '状态不能为空' }]}
            >
              <Radio.Group>
                <Radio value={true}>激活</Radio>
                <Radio value={false}>禁用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form >
    </div >
  )
}

export default ModuleEdit
