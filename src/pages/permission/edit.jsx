import { Row, Col, Form, Input, message, Radio, Select } from "antd";
import { useState, useEffect, useImperativeHandle } from "react";
import { addPermission, updatePermission } from "@/api/permission";
import { getModules } from "@/api/module";


const PermissionEdit = (props) => {
  //使用useImperativeHandle向父组件暴露子组件的方法
  useImperativeHandle(props.onRef, () => ({
    confirm // 将子组件的confirm方法暴露给父组件
  }));
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = useState('');
  const [pid, setPid] = useState("")
  const [moduleOptions, setModuleOptions] = useState([])

  useEffect(() => {
    init();
    getModuleOptions()
  }, []);
  //初始化
  const init = () => {
    const data = props.data
    setPid(data.pid)
    if (data.id !== undefined && data.id !== null && data.id !== '') {
      setId(data.id);
      form.setFieldsValue(data);
    } else {
      setId('');
      defaultValue()
    }
  }
  //默认值
  const defaultValue = () => {
    form.setFieldsValue({
      enabled: true,
      isButton: false,
      isHide: false,
      iskeepAlive: false
    });
  }
  //确定按钮事件
  const confirm = () => {
    form.validateFields().then((values) => {
      values.pid = pid
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
    let res = await addPermission(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(1)
    }
    props.setLoading(false)
  }
  //修改
  const update = async (data) => {
    let res = await updatePermission(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(2)
    }
  }
  //修改
  const getModuleOptions = async () => {
    let res = await getModules({ page: -1 })
    if (res?.status === 200) {
      setModuleOptions(res.data.data)
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
          <Col span={12}>
            <Form.Item
              label="序号"
              name="orderSort"
              rules={[{ required: true, message: '序号不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='菜单名称'
              name='name'
              rules={[{ required: true, message: '菜单名称不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='菜单图标'
              name='icon'
              rules={[{ required: true, message: '菜单图标不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='路由地址'
              name='code'
              rules={[{ required: true, message: '路由地址不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="描述"
              name="description"
            >
              <Input
                className='input-width'
                placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='是否按钮'
              name='isButton'
              rules={[{ required: true, message: '是否按钮不能为空' }]}
            >
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="按钮事件"
              name="func"
            >
              <Input
                className='input-width'
                placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='隐藏菜单'
              name='isHide'
              rules={[{ required: true, message: '隐藏菜单不能为空' }]}
            >
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item
              label='keepAlive'
              name='iskeepAlive'
              rules={[{ required: true, message: 'keepAlive不能为空' }]}
            >
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='API接口'
              name='mid'
            >
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="label"
                allowClear
                filterOption={(input, option) => {
                  return (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
                }
                }
                className="select-width"
                fieldNames={{ label: 'name', value: 'id' }}
                options={moduleOptions}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form >
    </div >
  )
}

export default PermissionEdit
