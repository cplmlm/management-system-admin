import React, { useEffect, useRef, useState } from 'react';
import { Space, Table, Input, Row, Col, Form, Button, Modal, message } from 'antd';
import { createIcon } from '@/common/utils';
import { getOrganizations, deleteOrganization } from "@/api/organization";
import Edit from './edit.jsx'

const Organization = () => {
    const [form] = Form.useForm();
    //定义子组件useRef
    const childrenRef = useRef();
    const [modalContent, setModalContent] = useState("")
    const [messageApi, contextHolder] = message.useMessage();
    const [modalWidth, setModalWidth] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [data, setData] = useState([])
    const [expandedRowKeys, setExpandedRowKeys] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [defaultPagination, setDefaultPagination] = useState({ page: 1, pageSize: 10 })//初始分页
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0, size: 'small',showSizeChanger:false,showQuickJumper: true, showTotal: (total) => `共 ${total} 条` })//分页 条` })//分页

    useEffect(() => {
        getDataList(pagination)
    }, [])
    //新增
    const handleAddClick = (record) => {
        setConfirmLoading(false)
        const modules =import.meta.glob('./edit.jsx');
        const lazyPage = React.lazy(modules['./edit.jsx']);
        modalWindow(lazyPage, "用户新增", 800, { id: "",parentId:record.id })
    }
    //修改
    const handleEditClick = (record) => {
        const modules =import.meta.glob('./edit.jsx');
        const lazyPage = React.lazy(modules['./edit.jsx']);
        modalWindow(lazyPage, "用户修改", 800, record)
    }
    //删除
    const handleDeleteClick = (record) => {
        Modal.confirm({
            title: '确认提示',
            maskClosable: true,
            closable: true,
             icon: createIcon("DeleteOutlined", "#ff0000"),
            content: '确定要删除吗？',
            centered: true,
            onOk() {
                handleDeleteOrganizationOk(record.id)
            },
            okText: '确认',
            cancelText: '取消',
        })
    }
    //删除
    const handleDeleteOrganizationOk = async (id) => {
        let res = await deleteOrganization(id)
        if (res?.status === 200) {
            messageApi.success(res.message)
            getDataList(pagination)
        }
    }
    //查询条件表单提交
        const queryOnClick = () => {
        getDataList(defaultPagination)
    }
    /**
     * Modal 窗口弹出框
     * @param {string} path 
     * @param {string} title 
     * @param {number} width 
     * @param {*} data 
     */
    const modalWindow = (lazyPage, title, width, data) => {
        const LazyPage=lazyPage
        const content = <LazyPage onRef={childrenRef} data={data} setLoading={setLoading} closeModal={closeModal} />
        setTitle(title)
        setModalWidth(width)
        setModalContent(content)
        setIsModalOpen(true)
    }
     /**
     * 关闭弹出框
     * @param {number} type 1-新增 2-修改
     */
    const closeModal = (type) => {
        setIsModalOpen(false)
        //如果是修改，则重新根据当前页码获取列表，新增时默认获取第一页列表
        if (type===2) {
            getDataList(pagination)
        } else {
            getDataList(defaultPagination)
        }
    }
    //弹出框确定按钮事件
    const handleOk = () => {
        childrenRef.current.confirm()//调用子组件的confirm方法
    }
    //设置提交确认按钮状态
    const setLoading = (state) => {
        setConfirmLoading(state)
    }
    //获取数据列表
    const getDataList = async (pagination) => {
        const values = form.getFieldsValue();
        const data = Object.assign({}, values, { page: pagination.current, key: values.name })
        let res = await getOrganizations(data)
        if (res?.status === 200) {
          // 默认都有children，方便table生成展开功能
          const tableData = res.data;
          tableData?.map((item) => {
              item.children = [];
              return item;
          });
          setData(tableData)
        }
    }
    //表格改变事件
    const handleChange = (pagination) => {
        getDataList({ current: pagination.current })
    }
    //展开事件
    const onExpand = async (expanded, record) => {
        //expanded是否展开  record每一项的值
        const id = record.id;
        const pList = data;
        if (!expanded) return;
        if (record.children?.length > 0) return;
        const parameter = { parentId: id, number: record?.key * 10 };
        let res = await getOrganizations(parameter)
        if (res?.status !== 200) {
            return;
        }
        if (res.data.length === 0) {
            return;
        }
        let tableData = res.data || [];
        tableData?.map((item) => {
            if (item.hasChildren) {
                item.children = [];
            }
            return item;
        });
        // 递归遍历查找当前项，并将children插入
        const dataMap = (items) => {
            items.find((item) => {
                if (item.id === id) {
                    item.children = tableData;
                    return item;
                }
                if (item.children?.length > 0) {
                    dataMap(item.children);
                }
            });
        };
        dataMap(pList);
        setData([...pList]);
    };
    //展开的行变化时触发
    const handleExpandedRowsChange = (key) => {
        setExpandedRowKeys(key)
    }
    const columns = [
        {
            title: '机构名称',
            dataIndex: 'name',
            align: "center",
            width: 120,
            ellipsis: true
        },
        {
            title: '机构简称',
            dataIndex: 'shortName',
            align: "center",
            width: 100
        },
        {
            title: '机构编码',
            dataIndex: 'code',
            align: "center",
            width: 100
        },
        {
            title: '联系电话',
            dataIndex: 'tel',
            align: "center",
            width: 100
        },
        {
            title: '组织机构代码',
            dataIndex: 'certificateCode',
            align: "center",
            width: 150
        },
        {
            title: '对接机构代码',
            dataIndex: 'healthcareCode',
            align: "center",
            width: 150,
            ellipsis: true
        },
        {
            title: '地址',
            dataIndex: 'address',
            align: "center",
            width: 200,
            ellipsis: true
        },

        {
            title: '医院等级',
            dataIndex: 'hospitalLevel',
            align: "center",
            width: 80
        },
        {
            title: '医院类型',
            dataIndex: 'grade',
            align: "center",
            width: 80
        },
        {
            title: '医院性质',
            dataIndex: 'property',
            align: "center",
            width: 80
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                     <Button type="link" size='small' icon={createIcon('PlusOutlined')} onClick={(e) => handleAddClick(record)}>新增</Button>
                    <Button type="link" size='small' icon={createIcon('EditOutlined')} onClick={(e) => handleEditClick(record)}>修改</Button>
                    <Button type="link"  size='small' danger  icon={createIcon('DeleteOutlined')} onClick={e => handleDeleteClick(record)}>删除</Button>
                </Space>
            )
        },
    ];
    return (
        <div className='main-content'>
            {contextHolder}
            <Form
                form={form}
            >
                <Row>
                    <Col span={6}>
                        <Form.Item
                            label="机构名称"
                            name="name"
                        >
                            <Input
                                className='input-width'
                                placeholder="请输入机构名称" />
                        </Form.Item>
                    </Col>
                    <Col span={18} style={{ textAlign: 'right' }}>
                        <Button type="default"  onClick={queryOnClick} icon={createIcon('SearchOutlined')}> 搜索 </Button>&nbsp;&nbsp;
                        <Button type="primary" onClick={handleAddClick} icon={createIcon('PlusOutlined')}>新增</Button>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={columns}
                onChange={handleChange}
                dataSource={data}
                bordered={true}
                scroll={{ y: 630}}
                expandedRowKeys={expandedRowKeys}
                onExpandedRowsChange={handleExpandedRowsChange}
                onExpand={onExpand}
                pagination={false} />
            {/*弹出窗口 */}
            <Modal
                title={title}
                width={modalWidth}
                okText="提交"
                open={isModalOpen}
                confirmLoading={confirmLoading}
                centered
                onOk={handleOk}
                destroyOnClose
                onCancel={() => setIsModalOpen(false)}>
                {modalContent}
            </Modal>
        </div>
    );
};

export default Organization;