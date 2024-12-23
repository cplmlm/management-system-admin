import { Select, Row, Col, Form, Input, message, InputNumber  } from "antd";
import { useState, useEffect, useImperativeHandle } from "react";
import { addOrganization, updateOrganization } from "@/api/organization";
import { set } from "mobx";


const OrganizationEdit = (props) => {
  //使用useImperativeHandle向父组件暴露子组件的方法
  useImperativeHandle(props.onRef, () => ({
    confirm // 将子组件的confirm方法暴露给父组件
  }));
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState('');
  const [parentId, setParentId]= useState('');

  useEffect(() => {
    init();
  }, []);
  //初始化
  const init = () => {
    const data = props.data
    setParentId(data.parentId);
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
      values.parentId = parentId
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
    let res = await addOrganization(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(1)
    }
    props.setLoading(false)
  }
  //修改
  const update = async (data) => {
    let res = await updateOrganization(data)
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
          span: 6
        }}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label='机构名称'
              name='name'
              rules={[{ required: true, message: '机构名称不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='机构简称'
              name='shortName'
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='机构编码'
              name='code'
              rules={[{ required: true, message: '机构编码不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='联系电话'
              name='tel'
            >
              <InputNumber
                className='input-width'
                placeholder='请输入'
                maxLength={11}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='组织机构代码'
              name='certificateCode'
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='对接机构代码'
              name='healthcareCode'
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label='地址'
              name='address'
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='医院等级'
              name='hospitalLevel'
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='医院类型'
              name='grade'
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='医院性质'
              name='property'
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

export default OrganizationEdit
