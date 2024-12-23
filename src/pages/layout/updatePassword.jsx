import { Row, Col, Form, Input, message } from "antd";
import { useImperativeHandle } from "react";
import { LockOutlined } from "@ant-design/icons";
import userStore from "@/store/index";
import { updatePassword } from "@/api/user";
import { toJS } from "mobx";

const UpdatePassword = (props) => {
    //使用useImperativeHandle向父组件暴露子组件的方法
    useImperativeHandle(props.onRef, () => ({
        confirm // 将子组件的confirm方法暴露给父组件
    }));
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    //确定按钮事件
    const confirm = () => {
        form.validateFields().then((values) => {
            if (values.newPassword === values.confirmPassword) {
                const user = toJS(userStore.userInfo)
                user.oldLoginPWD = values.oldLoginPWD
                user.loginPWD = values.newPassword
                update(user)
            } else {
                messageApi.error('两次输入密码不一致')
            }
        }).catch((errorInfo) => {

        });
    }

    //修改
    const update = async (data) => {
        let res = await updatePassword(data)
        if (res?.status === 200) {
            messageApi.success(res.message)
            props.closeModal()
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
                            label='旧密码'
                            name='oldLoginPWD'
                            rules={[{ required: true, message: '旧密码不能为空' }]}
                        >
                            <Input
                                className='input-width'
                                placeholder='请输入'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='新密码'
                            name='newPassword'
                            rules={[{ required: true, message: '新密码不能为空' }]}
                        >
                            <Input.Password
                                autoComplete="new-password"
                                className='input-width'
                                placeholder="密码" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='确认密码'
                            name='confirmPassword'
                            rules={[{ required: true, message: '确认密码不能为空' }]}
                        >
                            <Input.Password
                                className='input-width'
                                autoComplete="new-password"
                                placeholder="密码" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form >
        </div >
    )
}

export default UpdatePassword
