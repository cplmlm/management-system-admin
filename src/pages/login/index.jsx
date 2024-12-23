import React, { useState, useEffect, useRef } from 'react';
import { Modal, message, Input, Col, Row, Flex, Skeleton  } from "antd";
import LoginForm from "./components/LoginForm";
import loginLeft from "@/assets/images/login_left5.png";
import logo from "@/assets/images/logo.png";
import "./index.less";
import dayjs from "dayjs";
import { generateMachineCode, systemRegister, getSystemRegisterInfo } from '@/api/authorization'
import { gcalculateDaysBetweenDates } from "@/common/utils";

const { TextArea } = Input;
const Login = () => {
	//定义子组件useRef
	const childrenRef = useRef();
	const [modal, contextHolder] = Modal.useModal();
	const [machineCode, setMachineCode] = useState("")
	const [registerCode, setRegisterCode] = useState("")
	const [modalVisible, setModalVisible] = useState(false)
	const [data, setData] = useState(null)

	useEffect(() => {
		//getSystemRegisterData()
	}, [])
	const getSystemRegisterData = async () => {
		const res = await getSystemRegisterInfo()
		if (res?.status === 200) {
			setData(res.data)
			registerTipsMessage(res.data)
		}
	}
	const handleRegisterClick = async () => {
		const res = await generateMachineCode()
		if (res?.status === 200) {
			setMachineCode(res.data)
			setModalVisible(true)
		}
	}
	// 系统注册提示
	const registerTipsMessage = (data) => {
		if (data === null) {
			registerTips("系统未注册，请先注册")
		} else {
			const daysBetween = gcalculateDaysBetweenDates(dayjs().format("YYYY-MM-DD"), data?.expiredTime)
			if (daysBetween < 0) {
				registerTips("系统注册已过期，请重新注册")
			}
			if (daysBetween < 7 && daysBetween >= 0) {
				expiredTimeTips(daysBetween)
			}
			if (!data?.isActive) {
				registerTips("系统授权未激活，请联系管理员激活")
			}
		}
	}
	// 注册码输入框
	const handleRegisterCodeChange = (e) => {
		setRegisterCode(e.target.value)
	}
	const handleSystemRegisterOk = async () => {
		if (registerCode === "") {
			modal.error({
				title: '系统提示',
				centered: true,
				content: "请输入注册码"
			})
		} else {
			const res = await systemRegister({ registerCode: registerCode })
			if (res?.status === 200) {
				message.success("注册成功")
				setModalVisible(false)
				getSystemRegisterData()
				childrenRef.registerSuccess()
			}
		}
	}
	// 系统注册到期时间提醒
	const expiredTimeTips = (day) => {
		modal.info({
			title: '系统提示',
			centered: true,
			content: "系统注册到期时间还有" + day + "天"
		})
	}
	//系统未注册或注册已过期提示
	const registerTips = (content) => {
		modal.error({
			title: '系统提示',
			centered: true,
			content: content
		})
	}
	const handleRegisterInfoClick = () => {
		modal.info({
			title: '注册信息',
			centered: true,
			content: <>
				<Row gutter={[8, 8]}>
					<Col span={24}>机器码：{data?.machineCode}</Col>
					{/* <Col> 注册码：{data?.registerCode}</Col> */}
					<Col span={24}> 授权时间：{data?.registerTime}</Col>
					<Col span={24}> 授权到期时间：{data?.expiredTime}</Col>
					<Col span={24}> 授权是否有效：{active()}</Col>
				</Row>
			</>
		})
	}
	const active = () => {
		if (data?.isActive) {
			return data?.isActive ? "有效" : "无效"
		} else {
			return false
		}
	}
	return (
		<div className="login-container">
			{contextHolder}
			<div className="login-box">
				<div className="login-left">
				</div>
				<div className="login-form">
					<div className="login-logo">
						<span className="logo-text">智慧体检系统</span>
					</div>
							<LoginForm  onRef={childrenRef} />
					<Flex justify="space-between">
						<div className="register" onClick={handleRegisterClick}>系统注册</div>
						<div className="register" onClick={handleRegisterInfoClick}>注册信息</div>
					</Flex>
				</div>
			</div>
			<div className='icp-info' onClick={()=>window.open("https://beian.miit.gov.cn/", '_blank')}>蜀ICP备2024093612号-2</div>
			<Modal
				title="系统注册"
				open={modalVisible}
				centered
				okText="注册"
				closable
				onOk={handleSystemRegisterOk}
				onCancel={() => setModalVisible(false)}
			>
				<div className="form-content">
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<TextArea
								rows={2}
								placeholder="请输入机器码"
								value={machineCode}
								readOnly={true}
							/>
						</Col>
						<Col span={24}>
							<TextArea
								rows={8}
								value={registerCode}
								placeholder="请输入注册码"
								onChange={handleRegisterCodeChange}
							/>
						</Col>
					</Row>
				</div>
			</Modal>
		</div>
	);
};

export default Login;




