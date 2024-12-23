import { useNavigate, Outlet } from "react-router-dom";
import React, { useEffect, useState, useRef } from 'react';
import { Button, Layout, Menu, theme, Breadcrumb, Dropdown, Avatar, Spin, Modal, Skeleton, message } from 'antd';
import { createIcon } from "@/common/utils"
import avatar from "@/assets/images/man.png";
import "./index.less";
import { getNavigationBar } from "@/api/permission";
import { observer } from "mobx-react-lite"
import userStore from "@/store/index";
import { toJS } from "mobx";
import { getAreaTree } from "@/api/area";
import menuStore from "@/store/menu";
import tabsStore from "@/store/tabs";
import UpdatePassword from './updatePassword'
import LayoutTabs from "./Tabs/index";
import { useLocation } from "react-router-dom";
import { getAllDictionaryItems, updateRedisDictionaryItems } from '@/api/dictionary';
import dictionaryStore from "@/store/dictionary";
import { getAllOrganizations } from "@/api/organization";


const { Header, Sider, Content } = Layout;
const LayoutIndex = observer(() => {
	//定义子组件useRef
	const childrenRef = useRef();
	const navigate = useNavigate()
	const [collapsed, setCollapsed] = useState(false);
	const [menus, setMenus] = useState([])
	const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
	const [spinning, setSpinning] = useState(false);
	const [percent, setPercent] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modal, contextModalHolder] = Modal.useModal();
	const [messageApi, contextMessageHolder] = message.useMessage();
	const [breadcrumbItems, setBreadcrumbItems] = useState([])
	const { pathname } = useLocation();
	const [selectedKeys, setSelectedKeys] = useState(["首页"]);
	const [openKeys, setOpenKeys] = useState(["首页"]);

	useEffect(() => {
		console.log(colorBgContainer, borderRadiusLG )
		getMenus()
		getAreaTreeData()
		getBreadcrumbItems()
		getAllDictionaries()
		getOrganizationList()
	}, [pathname])
	// 点击菜单
	const clickMenu = (e) => {
		const keys = e.keyPath;
		const key = e.item.props.path
		const included = key.includes("DataScreen")
		// 判断是否是数据大屏,如果是，面包屑就不需要保存数据
		if (!included) {
			const breadcrumbItems = []
			// 菜单所有节点的顺序和面包屑需要的数据是相反，所以需要反转数组
			for (let i = keys.length - 1; i >= 0; i--) {
				breadcrumbItems.push({ title: keys[i] });
			}
			setBreadcrumbItems(breadcrumbItems)
		}
		const url = included ? "/" + key : key;//如果是数据大屏需要加/，为了直接跳转到数据可视化大屏页面
		navigate(url)
		setSelectedKeys(keys)
		setOpenKeys(keys)
	}
	// 获取所有字典项目
	const getAllDictionaries = async () => {
		const dictionaries = toJS(dictionaryStore.dictionaries);
		if (dictionaries.length === 0) {
			const res = await getAllDictionaryItems()
			if (res?.status === 200) {
				dictionaryStore.setDictionaries(toJS(res.data));
			}
		}
	}
	// 解决页面以及tabs关闭后面的tabs切换时，面包屑数据丢失的问题
	const getBreadcrumbItems = () => {
		const path = pathname.split("/").pop();
		const parents = findParents(toJS(menuStore.menus), path);
		const tabs = toJS(tabsStore.tabs);
		const currentMenu = tabs.find(item => item.key === path)?.label
		let breadcrumbItems = []
		parents?.map(item => {
			breadcrumbItems.push({ title: item.label })
		})
		breadcrumbItems.push({ title: currentMenu })
		setBreadcrumbItems(breadcrumbItems)
		//tabs切换时选中对应的菜单
		let keys = []
		// 菜单选中节点的顺序和面包屑需要的数据是相反，所以需要反转数组
		for (let i = breadcrumbItems.length - 1; i >= 0; i--) {
			keys.push(breadcrumbItems[i].title);
		}
		setSelectedKeys(keys)
		setOpenKeys(keys)
	}
	// 设置当前展开的 subMenu
	const onOpenChange = (openKeys) => {
		setOpenKeys(openKeys);
	};
	// 获取地区树
	const getAreaTreeData = async () => {
		const areaTree = toJS(userStore.areas);
		if (areaTree.length === 0) {
			setSpinning(true);
			setPercent(-10)
			const res = await getAreaTree()
			if (res?.status === 200) {
				userStore.setAreas(toJS(res.data))
				setSpinning(false);
				setPercent(0);
			}
		}
	}
	// 获取菜单
	const getMenus = () => {
		const menus = toJS(menuStore.menus);
		if (menus.length > 0) {
			setMenuData(menus)
		} else {
			getNavigationBar({ uid: userStore.userInfo?.id }).then(res => {
				const data = res.data?.children;
				setMenuData(data)
				menuStore.setMenus(res.data?.children)
			})
		}
	}
	//找到父级数据
	const findParents = (data, key, parents = []) => {
		// 递归遍历数组中的每个节点
		for (const node of data) {
			// 如果找到目标key，返回当前累积的父节点数组
			if (node.path === key) {
				return parents;
			}
			// 如果节点有子节点，递归调用findParents
			if (node.children) {
				// 在递归调用之前，将当前节点添加到父节点数组中
				const result = findParents(node.children, key, [...parents, node]);
				// 如果在子节点中找到了目标key，则直接返回结果
				if (result) {
					return result
				}
			}
		}
		// 如果当前路径下没有找到目标key，返回null
		return null;
	}
	//获取所有机构列表
	const getOrganizationList = async () => {
		let res = await getAllOrganizations()
		if (res?.status === 200) {
			userStore.setOrganization(res.data)
		}
	}
	// 设置菜单数据
	const setMenuData = (data) => {
		// 递归遍历查找当前项，并将children插入
		const dataMap = (items) => {
			items?.find((item) => {
				item.key = item.name;//通过名称来做key是为了面包屑方便设置数据源
				item.icon = item.iconCls !== "-" ? createIcon(item.iconCls) : "";
				item.label = item.name;
				if (item.children?.length > 0) {
					dataMap(item.children);
				}
			});
		};
		dataMap(data);
		setMenus([...data]);
	}
	// 退出登录
	const logout = () => {
		modal.confirm({
			title: "确认退出登录？",
			centered: true,
			onOk: () => {
				reset()
			},
		});
	}
	// 更新字典
	const handleUpdateDictionaryClick = () => {
		modal.confirm({
			title: "确认要更新数据字典吗？",
			centered: true,
			onOk: () => {
				handleUpdateDictionaryOk()
			},
		});
	}
	// 更新字典
	const handleUpdateDictionaryOk = async () => {
		const res = await updateRedisDictionaryItems()
		if (res?.status === 200) {
			messageApi.success(res.message)
			dictionaryStore.reset()
			dictionaryStore.setDictionaries(res.data)
		}
	}
	//关闭弹出框
	const closeModal = () => {
		setIsModalOpen(false)
		reset()
	}
	/**
	 * 重置并跳转到登录页
	 */
	const reset=()=>{
		menuStore.resetMenus()
		tabsStore.resetTabs()
		userStore.reset()
		navigate('/')
	}
	//弹出框确定按钮事件
	const handleOk = () => {
		childrenRef.current.confirm()//调用子组件的confirm方法
	}
	const menu = (
		<Menu
			items={[
				{
					key: "1",
					label: <span className="dropdown-item">修改密码</span>,
					onClick: () => { setIsModalOpen(true) }
				},
				{
					type: "divider"
				},
				{
					key: "2",
					label: <span className="dropdown-item">退出登录</span>,
					onClick: logout
				}
			]}
		/>
	);
	return (
		<Layout className="menu">
			{contextModalHolder}
			{contextMessageHolder}
			<Sider width={220} trigger={null} collapsible collapsed={collapsed}>
				<div className="logo-vertical" >{collapsed ? "" : "体检系统"}</div>
				{
					menus?.length > 0 ?
						<Menu

							theme="dark"
							mode="inline"
							triggerSubMenuAction="click"
							openKeys={openKeys}
							selectedKeys={selectedKeys}
							items={menus}
							onClick={clickMenu}
							onOpenChange={onOpenChange}
						/> : <Skeleton />
				}
			</Sider>
			<Layout>
				<Header style={{ background: colorBgContainer, padding: 0 }}>
					<div className="header-lf">
						<Button
							type="text"
							title="展开/收起菜单"
							icon={collapsed ? createIcon("MenuUnfoldOutlined") : createIcon("MenuFoldOutlined")}
							onClick={() => setCollapsed(!collapsed)}
							style={{
								fontSize: '16px',
								width: 64,
								height: 64,
							}}
						/>
						<Breadcrumb items={breadcrumbItems} />
					</div>
					<div className="header-ri">
						<span title="更新字典数据" onClick={handleUpdateDictionaryClick} className="icon-style">{createIcon("DiffOutlined", "", 24)}</span>
						<span className="username">{userStore.userInfo?.name}</span>
						<Dropdown overlay={menu} placement="bottom" arrow trigger={["click"]}>
							<Avatar size="large" src={avatar} style={{ marginRight: 30 }} />
						</Dropdown>
					</div>
				</Header>
				<LayoutTabs />
				<Content
					style={{
						margin: '15px',
						//padding: 20,
						minHeight: 280,
						//background: colorBgContainer,
						borderRadius: borderRadiusLG,
						overflowY: "auto"
					}}
				>
					<Outlet></Outlet>
					<div className='icp-info' style={{color:"#000",right: 20}} onClick={()=>window.open("https://beian.miit.gov.cn/", '_blank')}>蜀ICP备2024093612号-2</div>
				</Content>
			</Layout>
			{/*修改密码弹出窗口 */}
			<Modal
				title="修改密码"
				width={400}
				open={isModalOpen}
				centered
				onOk={handleOk}
				destroyOnClose
				onCancel={() => setIsModalOpen(false)}>
				<UpdatePassword onRef={childrenRef} closeModal={closeModal} />
			</Modal>
			<Spin spinning={spinning} tip="正在下载初始化数据，请稍等！！！" percent={percent} fullscreen />
		</Layout>
	);
});
export default LayoutIndex;