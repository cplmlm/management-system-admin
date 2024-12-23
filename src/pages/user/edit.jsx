import { Select, DatePicker, Row, Col, Form, Input, message, Upload, Button } from "antd";
import { useState, useEffect, useImperativeHandle } from "react";
import { addUser, updateUser, getPlaintextPassword } from "@/api/user";
import { getAllRoles } from "@/api/role";
import { convertToDayjs, createIcon, dictionaryItems } from "@/common/utils";

const UserEdit = (props) => {
  //使用useImperativeHandle向父组件暴露子组件的方法
  useImperativeHandle(props.onRef, () => ({
    confirm // 将子组件的confirm方法暴露给父组件
  }));
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [roleOptions, setRoleOptions] = useState(false);
  const [id, setId] = useState('');
  const [fileList, setFileList] = useState([]);
  const [signature, setSignature] = useState("")
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    init();
    getRoleOptions();
  }, []);
  //初始化
  const init = () => {
    const data = props.data
    if (data.id !== undefined && data.id !== null && data.id !== '') {
      updatePage(data);
    } else {
      setId('');
    }
  }
  //修改页面
  const updatePage = async (data) => {
    setId(data.id);
    setImageUrl(data.signature)
    data.loginPWD = await getPlaintext(data?.loginPWD);
    data.birthDate = convertToDayjs(data.birthDate);
    form.setFieldsValue(data);
  }
  //获取明文密码
  const getPlaintext = async (ciphertext) => {
    let password = ""
    if (ciphertext !== null && ciphertext !== undefined && ciphertext !== '') {
      const res = await getPlaintextPassword(ciphertext)
      if (res?.status === 200) {
        password = res.data
      }
    }
    return password
  }
  //确定按钮事件
  const confirm = () => {
    form.validateFields()
      .then((values) => {
        values.departmentName = ""
        values.dids = []
        // values.Name = values.realName
        values.roleNames = []
        values.signature = imageUrl
        if (id !== '') {
          values.id = id
          update(values)
        } else {
          values.RIDs = []
          submit(values)
        }
      }).catch((errorInfo) => {

      });
  }
  //新增
  const submit = async (data) => {
    props.setLoading(true)
    let res = await addUser(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(1)
    }
    props.setLoading(false)
  }
  //修改
  const update = async (data) => {
    let res = await updateUser(data)
    if (res?.status === 200) {
      messageApi.success(res.message)
      props.closeModal(2)
    }
  }
  //获取角色列表
  const getRoleOptions = async () => {
    let res = await getAllRoles()
    if (res?.status === 200) {
      setRoleOptions(res.data)
    }
  }
  //上传
  const uploadProps = {
    accept: ".png",
    beforeUpload: (file) => {
      console.log(file);
      const isPNG = file.type === 'image/png';
      if (!isPNG) {
        messageApi.error(`${file.name} 不是png文件`);
        return false;
      }
      if (file.size > 1024 * 1024) {
        messageApi.error(`${file.name} 大小不能超过1M`);
        return false
      }
    },
    onChange: (info) => {
      console.log(info);
      // if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        console.log(url);
        setImageUrl(url);
      });
      //   }
    },
    fileList
  };
  //获取base64
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  return (
    <div className="form-content">
      {contextHolder}
      <Form
        form={form}
        preserve={false}
        labelCol={{
          span: 5
        }}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label='医院'
              name='organizationId'
              rules={[{ required: true, message: '医院不能为空' }]}
            >
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="label"
                className="select-width"
                fieldNames={{ label: 'name', value: 'id' }}
                options={props.organizationData}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='姓名'
              name='realName'
              rules={[{ required: true, message: '姓名不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='账号'
              name='loginName'
              rules={[{ required: true, message: '账号不能为空' }]}
            >
              <Input
                className='input-width'
                placeholder='请输入'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='密码'
              name='loginPWD'
              rules={[{ required: true, message: '密码不能为空' }]}
            >
              <Input.Password
                className='input-width'
                placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12} style={{ display: id !== "" ? 'block' : 'none' }}>
            <Form.Item
              label="角色"
              name="riDs"
            >
              <Select
                mode="multiple"
                showSearch
                placeholder="请选择"
                optionFilterProp="label"
                className="select-width"
                fieldNames={{ label: 'name', value: 'id' }}
                options={roleOptions}
              />
            </Form.Item>
          </Col >
          <Col span={12}>
            <Form.Item
              label="性别"
              name="gender"
            >
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="label"
                className="select-width"
                options={dictionaryItems('1819214015717576704', true)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='生日'
              name='birthDate'
            >
              <DatePicker
                className='select-width'
                placeholder='请选择'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='地址'
              name='address'
            >
              <Input
                placeholder="请输入"
                className="input-width"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='备注'
              name='remark'
            >
              <Input
                placeholder="请输入"
                className="input-width"
              />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item
              label='备注'
              name='remark'
            >
              <Input
                placeholder="请输入"
                className="input-width"
              />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item
              label='对接编码'
              name='name'
            >
              <Input
                placeholder="请输入"
                className="input-width"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='签名'
              name='signatureImage'
            >
              <img style={{ height: 25, width: 100, paddingRight: 20 }} src={imageUrl} />
              <Upload
                {...uploadProps}
              >
                <Button icon={createIcon('UploadOutlined')} type="primary" >签名图像</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form >
    </div >
  )
}

export default UserEdit
