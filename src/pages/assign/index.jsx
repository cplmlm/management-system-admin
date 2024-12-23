import React, { useEffect, useState } from 'react';
import { Table, Form, Button, message, Tree, Skeleton, Checkbox, Row, Col } from 'antd';
import { createIcon } from '@/common/utils';
import { getRoles } from "@/api/role";
import { getPermissionTree, getPermissionIdByRoleId, assign } from '@/api/permission';
import styles from './index.module.less'
import menuStore from '@/store/menu';

const Assign = () => {
    const [form] = Form.useForm();
    const [id, setId] = useState('')
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0, size: 'small', showSizeChanger: false, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` })//分页 条` })//分页
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [treeData, setTreeData] = useState([])
    const [assignBtns, setAssignBtns] = useState([])

    useEffect(() => {
        getDataList(pagination)
        getPermissionTreeData()
    }, [])
    //获取菜单树
    const getPermissionTreeData = async () => {
        const res = await getPermissionTree({ needbtn: false })
        if (res?.status === 200) {
            setTreeData(res.data?.children);
        }
    }
    //保存
    const handleSaveClick = async () => {
        if (id != null && id != "") {
            const pids = checkedKeys.concat(assignBtns)
            const data = {
                rid: id,
                pids: pids
            }
            setConfirmLoading(true)
            const res = await assign(data)
            if (res?.status === 200) {
                messageApi.success(res.message)
                menuStore.resetMenus()
            }
            setConfirmLoading(false)
        } else {
            messageApi.error("请选择角色")
        }
    }
    //获取数据列表
    const getDataList = async (pagination) => {
        const values = form.getFieldsValue();
        const data = Object.assign({}, values, { page: pagination.current, key: values.name })
        let res = await getRoles(data)
        if (res?.status === 200) {
            setData(res.data.data)
            setPagination(prevState => ({
                ...prevState,
                total: res.data.dataCount,
                pageSize: res.data.pageSize,
                current: res.data.page
            })
            )
        }
    }
    //表格改变事件
    const handleChange = (pagination) => {
        getDataList({ current: pagination.current })
    }
    //点击表格行
    const handleRowClick = async (record) => {
        setSelectedRowKeys([record.id])
        setId(record.id)
        const res = await getPermissionIdByRoleId({ rid: record.id })
        if (res?.status === 200) {
            setCheckedKeys(res.data?.permissionids)
            setAssignBtns(res.data?.assignbtns)
        }
    }
    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };
    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue.checked);
    };
    const fieldNames = {
        title: 'label', key: 'value', children: 'children'
    }
    //监听复选框变化
    const handleCheckboxChange = (value, checked) => {
        let newCheckedValues = assignBtns;
        if (checked) {
            newCheckedValues.push(value);
        } else {
            newCheckedValues = newCheckedValues.filter(item => item !== value);
        }
        setAssignBtns(newCheckedValues);
    };
    const columns = [
        {
            title: '角色',
            dataIndex: 'description',
            align: "center",
            ellipse: true
        }
    ]
    return (
        <div className='left-right-container'>
            {contextHolder}
            <div className="left">
                <Table
                    pagination={pagination}
                    columns={columns}
                    onChange={handleChange}
                    dataSource={data}
                    onRow={(record, rowIndex) => ({
                        onClick: () => handleRowClick(record),
                        style: {
                            background: selectedRowKeys.includes(record.id) ? "#f7f7f7" : '',
                        },
                    })
                    }
                />
            </div>
            <div className="right">
                <div style={{ textAlign: 'right',marginBottom:10 }}>
                    <Button type="primary" loading={confirmLoading} onClick={handleSaveClick} icon={createIcon('SaveOutlined')}>保存</Button>
                </div>
                {
                    treeData.length > 0 ?
                        <Tree
                            checkable
                            height={680}
                            defaultExpandAll={true}
                            onCheck={onCheck}
                            checkedKeys={checkedKeys}
                            checkStrictly
                            treeData={treeData}
                            fieldNames={fieldNames}
                            titleRender={(nodeData) => {
                                return (
                                    <div>
                                     <span style={{marginRight:20}}>{nodeData[fieldNames.title]}</span>
                                        {
                                            nodeData?.btns?.map((item, index) => (
                                                <Checkbox
                                                    key={item.value}
                                                    value={item.value}
                                                    checked={assignBtns.includes(item.value)}
                                                    onChange={(e) => handleCheckboxChange(item.value, e.target.checked)}
                                                >
                                                    {item.label}
                                                </Checkbox>
                                            ))
                                        }                          
                                    </div>
                                )
                            }}
                        /> : <Skeleton />
                }
            </div>
        </div>
    );
};

export default Assign;