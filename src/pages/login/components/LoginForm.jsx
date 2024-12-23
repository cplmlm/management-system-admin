import { useEffect, useState, useImperativeHandle } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { userLogin, getInfoByToken } from "@/api/user";
import userStore from "@/store/index";
import "../index.less";
import SlideVerify from '@/components/SlideVerify';
import tabsStore from '@/store/tabs'
import dayjs from "dayjs";
import { gcalculateDaysBetweenDates } from "@/common/utils";

const LoginForm = (props) => {
	//使用useImperativeHandle向父组件暴露子组件的方法
	useImperativeHandle(props.onRef, () => ({
		registerSuccess // 将子组件的registerSuccess方法暴露给父组件
	}));
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();
	const [disabled, setDisabled] = useState(true)
	const [readOnly, setReadOnly]=useState(false)

	useEffect(() => {
		//registerInfo(props.registerInfo)
	}, [])
	// 系统注册提示
	const registerInfo = (data) => {
		if (data === null) {
			setDisabled(true)
			setReadOnly(true)
		} else {
			const daysBetween = gcalculateDaysBetweenDates(dayjs().format("YYYY-MM-DD"), data?.expiredTime)
			if (daysBetween < 0) {
				setDisabled(true)
				setReadOnly(true)
			}
			if (!data?.isActive) {
				setDisabled(true)
				setReadOnly(true)
			}
		}
	}
	// 注册成功将禁用登录取消
	const registerSuccess = () => {
		setDisabled(false)
		setReadOnly(false)
	}
	// 登录
	const onFinish = async (loginForm) => {
		setLoading(true);
		const res = await userLogin(loginForm)
		if (res?.status === 200) {
			userStore.setToken(res.data?.token)
			getUserInfo(res.data?.token)
			//tabsStore.setTabs([{ label: "首页", key: "home", closable: false }])//初始化tabs
		}
		setLoading(false);
	};
	// 获取用户信息
	const getUserInfo = async (token) => {
		const res = await getInfoByToken(token)
		if (res?.status === 200) {
			userStore.setUserInfo(res.data)
			navigate("/layoutIndex/home")
		}
	}
	// 滑动验证
	const onSuccess = (e) => {
		setDisabled(false)
	}
	// 验证码加载失败时触发该回调参数。
	const onFail = (e) => {
		console.log('滑动验证失败时触发该回调参数。', e)
	}
	// 验证码加载出现异常时触发该回调参数。
	const onError = (e) => {
		console.log('验证码加载出现异常时触发该回调参数。', e)
	}

	const reqCode = async () => {
		// const res = await false // 返回失败情况
		// const res = await fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/diamond.json') // 返回成功
		// return res
		const res = await 'lkjsafdsafsaf'
		return res
	}

	const SlideVerifyProps = {
		width: '300px',
		height: '34px',
		defaultBg: '#e8e8e8',
		defaultText: '请按住滑块，拖动到最右边进行人机验证',
		loadingText: '验证中',
		successBg: '#1890ff',
		successText: '验证通过',
		onSuccess,
		onFail,
		onError,
		reqCode
	}
	return (
		<div>
			{contextHolder}
			<Form
				form={form}
				name="basic"
				labelCol={{ span: 5 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				size="large"
				autoComplete="off"
			>
				<Form.Item name="name" rules={[{ required: true, message: "请输入用户名" }]}>
					<Input placeholder="用户名"  prefix={<UserOutlined />} />
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
					<Input.Password  autoComplete="new-password" placeholder="密码" prefix={<LockOutlined />} />
				</Form.Item>
				<SlideVerify {...SlideVerifyProps} ></SlideVerify>
				<Button htmlType="submit" className="login-btn" type="primary"  disabled={disabled} loading={loading}>
					登录
				</Button>
			</Form>
		</div>
	);
};

export default LoginForm;
