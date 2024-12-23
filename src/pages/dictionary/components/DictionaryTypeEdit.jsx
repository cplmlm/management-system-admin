import { Row, Col, Form, Input, message } from "antd";
import { useState, useEffect, useImperativeHandle } from "react";
import { addDictionaryType, updateDictionaryType } from "@/api/dictionary";

const DictionaryTypeEdit = (props) => {
  //使用useImperativeHandle向父组件暴露子组件的方法
  useImperativeHandle(props.onRef, () => ({
    confirm // 将子组件的confirm方法暴露给父组件
  }));
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState('');

  useEffect(() => {
    init();
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
    let res = await addDictionaryType(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(1)
    }
    props.setLoading(false)
  }
  //修改
  const update = async (data) => {
    let res = await updateDictionaryType(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(1)
    }
  }
  return (
    <div className="form-content">
      {contextHolder}
      <Form
        form={form}
        preserve={false}
        labelCol={{
          span: 7
        }}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label='类型编码'
              name='code'
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label='类型名称'
              name='name'
              rules={[{ required: true, message: '字典类型名称不能为空' }]}
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

export default DictionaryTypeEdit
