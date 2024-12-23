import { Select, Row, Col, Form, Input, message } from "antd";
import { useState, useEffect, useImperativeHandle } from "react";
import { addArea, updateArea } from "@/api/area";

const AreaEdit = (props) => {
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
       values.oldId = id
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
    let res = await addArea(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(1)
    }
    props.setLoading(false)
  }
  //修改
  const update = async (data) => {
    let res = await updateArea(data)
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
        preserve={false}
        labelCol={{
          span: 6,
        }}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label='地区编码'
              name='id'
              rules={[{ required: true, message: '地区编码不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label='地区名称'
              name='name'
              rules={[{ required: true, message: '地区名称不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="行政区划级别"
              name="deep"
            >
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="label"
                className="select-width"
                options={[
                  { label: '省级', value: 0 },
                  { label: '市级', value: 1 },
                  { label: '区县级', value: 2 },
                  { label: '乡镇级', value: 3 },
                  { label: '村级', value: 4 }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label='经纬度'
              name='geo'
            >
              <Input
                className='input-width'
                placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
      </Form >
    </div >
  )
}

export default AreaEdit
