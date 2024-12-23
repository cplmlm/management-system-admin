import { useEffect, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import tabsStore from '@/store/tabs'

const MoreButton = (props) => {
	const { pathname } = useLocation();
	const [path, setPath] = useState("")
	const navigate = useNavigate();

	useEffect(() => {
		setPath(pathname.split('/').pop())
	}, [pathname])
	// 关闭其它及关闭所有
	const closeMultipleTab = (tabPath) => {
		const handleTabsList = props.tabsList.filter((item) => {
			return item.key === tabPath || item.key === "home";
		});
		props.setTabsList(handleTabsList);
		tabsStore.setTabs(handleTabsList)
		tabPath ?? navigate("home");
	};

	const menu = (
		<Menu
			items={[
				{
					key: "1",
					label: "关闭其它",
					onClick: () => closeMultipleTab(path)
				},
				{
					key: "2",
					label: "关闭所有",
					onClick: () => closeMultipleTab()
				}
			]}
		/>
	);
	return (
		<Dropdown overlay={menu} placement="bottom" arrow={{ pointAtCenter: true }} trigger={["click"]}>
			<Button className="more-button" type="default" size="small">
				<DownOutlined />
			</Button>
		</Dropdown>
	);
}
export default MoreButton;
