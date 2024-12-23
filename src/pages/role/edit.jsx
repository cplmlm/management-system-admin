import { Select, Row, Col, Form, Input, message, Radio } from "antd";
import { useState, useEffect, useImperativeHandle } from "react";
import { addRole, updateRole } from "@/api/role";


const RoleEdit = (props) => {
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
    let res = await addRole(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(1)
    }
    props.setLoading(false)
  }
  //修改
  const update = async (data) => {
    let res = await updateRole(data)
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
          span: 5,
        }}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label='角色名'
              name='name'
              rules={[{ required: true, message: '角色名不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label='角色说明'
              name='description'
              rules={[{ required: true, message: '角色说明不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="权限范围"
              name="authorityScope"
            >
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="label"
                className="select-width"
                options={[
                  { label: '无任何数据权限', value: -1 },
                  { label: '自定义数据权限', value: 1 },
                  { label: '本部门数据权限', value: 2 },
                  { label: '本部门及以下所有部门', value: 3 },
                  { label: '仅自己数据权限', value: 4 },
                  { label: '全部数据权限', value: 9 }
                ]}
              />
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

export default RoleEdit
