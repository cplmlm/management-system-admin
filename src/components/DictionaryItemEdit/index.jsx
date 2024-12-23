import { Row, Col, Form, Input, message, InputNumber, Modal } from "antd";
import { useState, useEffect, useImperativeHandle } from "react";
import { addDictionaryItem, updateDictionaryItem } from "@/api/dictionary";

const DictionaryItemEdit = (props) => {
  //使用useImperativeHandle向父组件暴露子组件的方法
  useImperativeHandle(props.onRef, () => ({
    confirm // 将子组件的confirm方法暴露给父组件
  }));
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState('');
  const [dictionaryTypeId, setDictionaryTypeId] = useState('');
  const [serialNumber, setSerialNumber] = useState(0);
  const [modal, contextModalHolder] = Modal.useModal();

  useEffect(() => {
    init();
  }, []);
  //初始化
  const init = () => {
    const data = props.data
    setDictionaryTypeId(data.dictionaryTypeId)
    if (data.id !== undefined && data.id !== null && data.id !== '') {
      setId(data.id);
      form.setFieldsValue(data);
    } else {
      form.setFieldsValue({ serialNumber: data.serialNumber })
      setSerialNumber(data.serialNumber)
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
        values.dictionaryTypeId = dictionaryTypeId
        add(values)
      }
    }).catch((errorInfo) => {

    });
  }
  //新增
  const add = async (data) => {
    props.setLoading(true)
    let res = await addDictionaryItem(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      tips()
    }
    props.setLoading(false)
  }
  const tips = () => {
    modal.confirm({
      title: '是否继续创建字典？',
      content: '',
      okText: '是',
      cancelText: '否',
      centered: true,
      onOk() {
        form.resetFields()
        const number = serialNumber + 1
        form.setFieldsValue({ serialNumber: number, code: number })
        setSerialNumber(number)
      },
      onCancel() {
        props.closeModal(1)
      },
    });

  }
  //修改
  const update = async (data) => {
    let res = await updateDictionaryItem(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(1)
    }
  }
  return (
    <div className="form-content">
      {contextHolder}
      {contextModalHolder}
      <Form
        form={form}
        preserve={false}
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
              label='项目名称'
              name='name'
              rules={[{ required: true, message: '项目名称不能为空' }]}
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

export default DictionaryItemEdit
