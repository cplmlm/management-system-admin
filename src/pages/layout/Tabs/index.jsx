import { Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { globalRouters } from "@/router";
import { searchRoute } from "@/common/utils";
import MoreButton from "./components/MoreButton";
import "./index.less";
import tabsStore from '@/store/tabs'
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";

const LayoutTabs = observer(() => {
	const [tabsList, setTabsList] = useState([])
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [activeValue, setActiveValue] = useState("");
	const HOME_URL = "home"

	useEffect(() => {
		addTabs();
	}, [pathname]);

	// 点击标签栏
	const clickTabs = (path) => {
		navigate(path);
	};

	// 新增标签栏
	const addTabs = () => {
		const tabsList = toJS(tabsStore.tabs);
		const path = pathname.split('/').pop();// 获取最后一个路径名称
		const included = path.includes("DataScreen")
		// 判断是否是数据大屏,如果是，就不需要创建tabs
		if (!included) {
			const route = searchRoute(path, globalRouters.routes);
			let newTabsList = tabsList;
			// 如果标签栏为空，则添加首页
			if (tabsList.length === 0 && path !== "home") {
				newTabsList = [{ label: "首页", key: "home", closable: false }];
			}
			if (tabsList.every((item) => item.key !== route.path)) {
				newTabsList.push({ label: route.meta?.title, key: route.path, closable: route.path === "home" ? false : true });
			}
			setTabsList(newTabsList);
			tabsStore.setTabs(newTabsList)
			setActiveValue(path);
		}
	};

	//删除标签栏
	const delTabs = (tabPath) => {
		const path = pathname.split('/').pop();
		if (tabPath === "home") return;
		if (path === tabPath) {
			tabsList.forEach((item, index) => {
				if (item.key !== path) return;
				const nextTab = tabsList[index + 1] || tabsList[index - 1];
				if (!nextTab) return;
				navigate(nextTab.key);
			});
		}
		const newTabsList = tabsList.filter((item) => item.key !== tabPath);
		setTabsList(newTabsList);
		tabsStore.setTabs(newTabsList)
	};
	return (
		<div className="tabs">
			{/* <Tabs defaultActiveKey="1" items={tabsList} type="editable-card" hideAdd animated/> */}
			<Tabs
				animated
				activeKey={activeValue}
				onChange={clickTabs}
				hideAdd
				type="editable-card"
				onEdit={path => {
					delTabs(path);
				}}
				items={tabsList}
			/>
			<MoreButton tabsList={tabsList} delTabs={delTabs} setTabsList={setTabsList}></MoreButton>
		</div>
	);
});

export default LayoutTabs;
