import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Select, Button, message } from 'antd';
import { createIcon } from '@/common/utils';
import { generateRegisterCode, getSystemRegisterInfo, systemRegister } from '@/api/authorization'
import dayjs from "dayjs";

const { TextArea } = Input;
const Authorization = () => {
    const [registerCode, setRegisterCode] = useState("")
    const [timeUnit, setTimeUnit] = useState("hour");
    const [data, setData] = useState({})
    const [messageApi, contextHolder] = message.useMessage()
    const [number, setNumber] = useState("")

    useEffect(() => {
        getData()
    }, [])
    //生成注册码
    const handleGenerateClick = async () => {
        console.log(number);
        console.log(timeUnit);
        if (number === "" || timeUnit === "") {
            messageApi.error("请输入授权时间")
            return
        }
        let expiredTime = "";
        const numberInt = parseInt(number);
        const date = dayjs();
        switch (timeUnit) {
            case "hour":
                expiredTime = date.add(numberInt, 'hour').format("YYYY-MM-DD");
                break;
            case "day":
                expiredTime = date.add(numberInt, 'day').format("YYYY-MM-DD");
                break;
            case "month":
                expiredTime = date.add(numberInt, 'month').format("YYYY-MM-DD");
                break;
            case "year":
                expiredTime = date.add(numberInt, 'year').format("YYYY-MM-DD");
                break;
        }
        const res = await generateRegisterCode({ machineCode: data?.machineCode, expiredTime: expiredTime })
        if (res?.status === 200) {
            setRegisterCode(res.data)
            getData()
        }
    }
    //注册
    const handleRegisterClick = async () => {
        const res = await systemRegister({ registerCode: registerCode })
        if (res?.status === 200) {
            messageApi.success("注册成功")
        }
    }
    //获取系统注册信息
    const getData = async () => {
        let res = await getSystemRegisterInfo()
        if (res?.status === 200) {
            setData(res.data)
        }
    }

    // 注册码输入框
    const handleRegisterCodeChange = (e) => {
        setRegisterCode(e.target.value)
    }
    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setTimeUnit(value);
    };
    return (
         <div className='main-content'>
            {contextHolder}
            <Row gutter={[16, 16]}>
                <Col span={24}>机器码：{data?.machineCode}</Col>
                <Col span={24}> 注册码：{data?.registerCode}</Col>
                <Col span={24}> 授权时间：{data?.registerTime}</Col>
                <Col span={24}> 授权到期时间：{data?.expiredTime}</Col>
                <Col span={24}> 授权是否有效：{data?.isActive ? "有效" : "无效"}</Col>
                <Col span={24}>
                    <Input
                        placeholder="请输入"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Select
                        style={{
                            width: 100,
                        }}
                        defaultValue={"hour"}
                        onChange={handleChange}
                        options={[
                            {
                                value: 'hour',
                                label: '小时',
                            },
                            {
                                value: 'day',
                                label: '天',
                            },
                            {
                                value: 'month',
                                label: '月',
                            },
                            {
                                value: 'year',
                                label: '年',
                            },
                        ]}
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
                <Col span={24}>
                    <Button type="default"  onClick={handleGenerateClick} icon={createIcon('DiffOutlined')}> 生成注册码 </Button>&nbsp;&nbsp;
                    <Button type="primary" onClick={handleRegisterClick} icon={createIcon('SaveOutlined')}>注册</Button>
                </Col>
            </Row>
        </div >
    );
};

export default Authorization;