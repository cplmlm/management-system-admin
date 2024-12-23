import { Switch } from "antd";

const SwitchDark = (props) => {
	const { setThemeConfig, themeConfig } = props;
	const onChange = (checked) => {
		setThemeConfig({ ...themeConfig, isDark: checked });
	};

	return (
		<Switch
			className="dark"
			defaultChecked={themeConfig.isDark}
			checkedChildren={<>🌞</>}
			unCheckedChildren={<>🌜</>}
			onChange={onChange}
		/>
	);
};

export default SwitchDark;
