import welcome from "@/assets/images/welcome01.png";
import "./index.less";
import { useEffect } from "react";

const Home = () => {
	useEffect(() => {
		//getAreaTreeData()
	}, [])

	return (
		<div className="home card    main-content">
			<img src={welcome} alt="welcome" />
		</div>
	);
};

export default Home;
