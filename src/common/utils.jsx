import * as Icons from "@ant-design/icons";
import React from 'react';
import dayjs from "dayjs";
import dictionaryStore from "@/store/dictionary";
import appStore from "@/store/index";
import { toJS } from "mobx";
import { message } from "antd";
import * as ExcelJs from 'exceljs';
import { saveAs } from "file-saver";
import { File } from 'better-xlsx';


/**
 * 动态生成图标
 * @param {string} name 
 * @returns 
 */
export const createIcon = (name, color, fontSize) => {
	return React.createElement(Icons[name], { style: { fontSize: fontSize ? fontSize : 17, color: color } });;
}

/**
 * 将字符串转换为日期
 * @param {string} date 
 * @returns 
 */
export const convertToDayjs = (date) => {
	return date !== null && date !== '' && date !== undefined ? dayjs(date) : ""
};

/**
 * 是否为空值获未定义
 * @param {string} value 
 * @returns 满足条件返回值，否则返回空字符串
 */
export const isNullOrEmptyOrUndefined = (value) => {
	return value !== null && value != "" && value !== undefined ? value : ""
};

/**
 * 将日期转换为日期字符串YYYY-MM-DD
 * @param {string} date 
 * @returns 
 */
export const dayjsToDateString = (date) => {
	return dayjs(date).isValid() ? dayjs(date).format("YYYY-MM-DD") : date
};

/**
 * 将日期转换为日期字符串YYYY-MM-DD
 * @param {string} date 
 * @returns 
 */
export const dayjsToDateTimeString = (date) => {
	return dayjs(date).isValid() ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : date
};

/**
 * 通过字典类型编码或者字典类型主键获取字典项目
 * @param {string} key 字典类型编码或者字典类型主键
 * @param {bool} code 字典类型编码，如果要使用code做value的值就传true，默认false
 * @param {bool} isName 字典类型序号，如果要使用name做value的值就传true，默认false
 * @returns 字典项目列表
 */
export const dictionaryItems = (key, code = false, isNumber = true, isName = false) => {
	let dictionaryItems = []
	const dictionaries = toJS(dictionaryStore.dictionaries)
	if (dictionaries.length > 0) {
		const dictionary = dictionaries.filter(item => item.dictionaryTypeId === key);
		if (dictionary) {
			dictionary.map(item => {
				dictionaryItems.push({ label: item.name, value: isName ? item.name : getDictionaryItemValue(code, isNumber, item) })
			});
		}
	}
	return dictionaryItems;
}


/**
 * 获取字典Value值
 * @param {bool} code 
 * @param {bool} isNumber code是否使用数字 默认true
 * @param {object} data 字典值
 * @returns 
 */
const getDictionaryItemValue = (code, isNumber, data) => {
	if (code) {
		const isNumeric = /^\d+$/.test(data.code);
		return isNumeric && isNumber ? parseInt(data.code) : data.code;
	} else {
		return data.id
	}
}

/**
 * 将字符串转换为数组
 * @param {*} value 
 * @returns 
 */
export const convertFieldsIntoArrays = (value) => {
	if (value !== null && value !== undefined && value != '') {
		if (value?.includes(",")) {
			let arr = value.split(",");
			// 使用map方法将数组中的每个字符串元素转换为数字
			let numArr = arr.map(function (item) {
				return parseInt(item);
			});
			return numArr
		} else {
			return [Number(value)]
		}
	}
}

/**
 * 计算两个日期之间的天数
 * @param {string} startDateString 开始日期
 * @param {string} endDateString 结束日期
 */
export const gcalculateDaysBetweenDates = (startDateString, endDateString) => {
	const startDate = new Date(startDateString);
	const endDate = new Date(endDateString);
	const timeDifference = endDate.getTime() - startDate.getTime();// 计算时间差，结果为毫秒
	const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));    // 将时间差转换为天数
	return daysDifference;
}
/**
 * @description 递归查询对应的路由
 * @param {String} path 当前访问地址
 * @param {Array} routes 路由列表
 * @returns array
 */
export const searchRoute = (path, routes = []) => {
	let result = {};
	for (let item of routes) {
		if (item.path === path) return item;
		if (item.children) {
			const res = searchRoute(path, item.children);
			if (Object.keys(res).length) result = res;
		}
	}
	return result;
};


/**
 * 性别转换
 * @param {number} value 性别编码
 * @returns 性别文字
 */
export const genderConvertToString = (value) => {
    const  data=typeof value === 'string'?parseInt(value):value//如果是文本型数字转换成数字类型
	switch (data) {
		case 1:
			return "男"
		case 2:
			return "女"
		case 9:
			return "未说明的性别"
		case 0:
			return "未知的性别"
		default:
			return ""
	}
}

/**
 * 导出Excel
 * @param {Array} data 数据
 * @param {Array} columns 列
 * @param {String} name 文件名
 */
export function exportExcel(dataSource, column, fileName = '') {
	// 新建工作谱
	const file = new File();
	// 新建表
	let sheet = file.addSheet('sheet1');
	// 获取表头行数
	let depth = getDepth(column);
	// 获取表头的列数
	let columnNum = getColumns(column);
	// 新建表头行数
	let rowArr = [];
	for (let k = 0; k < depth; k++) {
		rowArr.push(sheet.addRow());
	}
	// 根据列数填充单元格
	rowArr.map(ele => {
		for (let j = 0; j < columnNum; j++) {
			let cell = ele.addCell();
			cell.value = j;
		}
	});
	// 初始化表头
	init(column, 0, 0);
	// 按顺序展平column
	let columnLineArr = [];
	columnLine(column);
	// 根据column,将dataSource里面的数据排序，并且转化为二维数组
	let dataSourceArr = [];
	dataSource.map(ele => {
		let dataTemp = [];
		columnLineArr.map(item => {
			dataTemp.push({
				[item.dataIndex]: ele[item.dataIndex],
				value: getValue(ele[item.dataIndex], item.dataIndex),
			});
		});
		dataSourceArr.push(dataTemp);
	});
	// debugger;
	// 绘画表格数据
	dataSourceArr.forEach((item, index) => {
		//根据数据,创建对应个数的行
		let row = sheet.addRow();
		row.setHeightCM(0.8);
		//创建对应个数的单元格
		item.map(ele => {
			let cell = row.addCell();
			if (ele.hasOwnProperty('num')) {
				cell.value = index + 1;
			} else {
				cell.value = ele.value;
			}
			cell.style.align.v = 'center';
			cell.style.align.h = 'center';
		});
	});
	//设置每列的宽度
	for (let i = 0; i < 4; i++) {
		sheet.col(i).width = 20;
	}
	file.saveAs('blob').then(function (content) {
		if (fileName === '') {
			fileName = dayjs().format('YYYY-MM-DD');
		}
		saveAs(content, fileName + '.xlsx');
	});
	// 数据处理
	function getValue(result, dataIndex) {
		// 日期格式转换
		if (isValidDate(result)) {
			result = dayjsToDateString(result);
		}
		// 性别转换
		if (dataIndex === "gender") {
			result = genderConvertToString(result);
		}
		return result
	}
	// 验证日期格式
	function isValidDate(dateStr) {
		const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
		return regex.test(dateStr);
	}
	// 按顺序展平column
	function columnLine(column) {
		column.map(ele => {
			if (ele.children === undefined || ele.children.length === 0) {
				columnLineArr.push(ele);
			} else {
				columnLine(ele.children);
			}
		});
	}
	// 初始化表头
	function init(column, rowIndex, columnIndex) {
		column.map((item, index) => {
			let hCell = sheet.cell(rowIndex, columnIndex);
			// 如果没有子元素, 撑满列
			if (item.title === '操作') {
				hCell.value = '';
				return;
			} else if (item.children === undefined || item.children.length === 0) {
				// 第一行加一个单元格
				hCell.value = item.title;
				hCell.vMerge = depth - rowIndex - 1;
				hCell.style.align.h = 'center';
				hCell.style.align.v = 'center';
				columnIndex++;
				// rowIndex++
			} else {
				let childrenNum = 0;
				function getColumns(arr) {
					arr.map(ele => {
						if (ele.children) {
							getColumns(ele.children);
						} else {
							childrenNum++;
						}
					});
				}
				getColumns(item.children);
				hCell.hMerge = childrenNum - 1;
				hCell.value = item.title;
				hCell.style.align.h = 'center';
				hCell.style.align.v = 'center';
				let rowCopy = rowIndex;
				rowCopy++;
				init(item.children, rowCopy, columnIndex);
				// 下次单元格起点
				columnIndex = columnIndex + childrenNum;
			}
		});
	}
	// 获取表头rows
	function getDepth(arr) {
		const eleDepths = [];
		arr.forEach(ele => {
			let depth = 0;
			if (Array.isArray(ele.children)) {
				depth = getDepth(ele.children);
			}
			eleDepths.push(depth);
		});
		return 1 + max(eleDepths);
	}

	function max(arr) {
		return arr.reduce((accu, curr) => {
			if (curr > accu) return curr;
			return accu;
		});
	}
	// 计算表头列数
	function getColumns(arr) {
		let columnNum = 0;
		arr.map(ele => {
			if (ele.children) {
				getColumns(ele.children);
			} else {
				columnNum++;
			}
		});
		return columnNum;
	}
}

export const exportExcelJS1 = async (list, tableColumn) => {
	/* eslint-disable */
	const workbook = new ExcelJs.Workbook();
	const sheet = workbook.addWorksheet("sheet1");  // 新建工作表
	let deepLength = 0;
	const columnsList = [];
	const header = [];
	const checkedLength = (data) => {
		if (data.children) {
			deepLength += 1;
			header.push([]);
			data.children.map((x) => {
				checkedLength(x);
			});
		} else {
			columnsList.push({ header: data.title, key: data.dataIndex });
		}
	}
	tableColumn.map((x) => {
		checkedLength(x);
	});
	//this.sheet.columns = columnsList; // 设置表头

	const setHeader = (data, deepNumber) => {
		if (data.children) {
			deepNumber++;
			data.children.map((x) => {
				setHeader(x, deepNumber);
			});
			const titleLength = header[deepNumber - 1].length - JSON.parse(JSON.stringify(header[deepNumber - 1])).reverse().findIndex((x) => x);
			header[deepNumber - 1][titleLength] = data.label;
		} else {
			for (let i in header) {
				if (i == deepNumber) {
					header[i].push(data.label);
				} else {
					header[i].push('');
				}
			}
		}
	};
	tableColumn.map((x) => {
		let deepNumber = 0;
		setHeader(x, deepNumber);
	});
	header.map((x, index) => {
		sheet.getRow(index + 1).values = x;
	})
	header.map((x, index) => {  // 合并表头
		x.map((y, indexY) => {
			if (y) {
				// 横向合并
				let endNumber = index;
				for (let i = index; i < deepLength; i++) {
					if (header[i + 1] && header[i + 1][indexY]) break;
					endNumber = i + 1;
				}
				if ((endNumber - index) >= 1) {
					try {
						sheet.mergeCells(`${this.letterMap[indexY]}${index + 1}:${this.letterMap[indexY]}${endNumber + 1}`);
						sheet.getCell(`${this.letterMap[indexY]}${index + 1}`).alignment = { vertical: 'middle' };
					} catch (error) {
						// console.log(error);
					}
				}
				// 纵向合并
				let rightNumber = indexY;
				for (let i = rightNumber + 1; i < x.length; i++) {
					if (x[i]) break;
					rightNumber = i;
				}
				if ((rightNumber - indexY) >= 1) {
					try {
						sheet.mergeCells(`${this.letterMap[indexY]}${index + 1}:${this.letterMap[rightNumber]}${index + 1}`);
						sheet.getCell(`${this.letterMap[indexY]}${index + 1}`).alignment = { vertical: 'middle' };
					} catch (error) {
						// console.log(error);
					}
				}
			}
		});
	})
	list.map((x) => {
		sheet.addRow(x);  // 写入数据
	});
	await workbook.xlsx.writeBuffer().then((data) => {
		const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
		const link = document.createElement("a"); // a标签下载
		link.href = window.URL.createObjectURL(blob); // href属性指定下载链接
		link.download = "导出.xlsx"; // dowload属性指定文件名
		link.click(); // click()事件触发下载
		window.URL.revokeObjectURL(link.href); // 释放内存
	});
}

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @return number
 */
export function randomNum(min, max) {
	let num = Math.floor(Math.random() * (min - max) + max);
	return num;
}
/**
 * 计算身份证号码信息
 * @param {string} idNumber 
 * @returns  出生日期、性别、年龄
 */
export function calculateInfoFromID(idNumber) {
	const idNumberReg = idNumber.replace(/\s+/g, '');
	if (idNumberReg.length !== 18) {
		message.error('身份证号码必须是18位数字,错误身份证号码:' + idNumberReg);
		return;
	}
	// 提取出生日期部分
	const birthDateStr = idNumberReg.substr(6, 8); // 从第7位开始截取8位
	const year = parseInt(birthDateStr.substr(0, 4), 10);
	const month = parseInt(birthDateStr.substr(4, 2), 10);
	const day = parseInt(birthDateStr.substr(6, 2), 10);
	// 创建日期对象
	const birthDate = new Date(year, month - 1, day);
	// 计算年龄
	const today = new Date();
	const ageInMilliseconds = today - birthDate;
	const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
	// 计算性别
	const genderCode = parseInt(idNumberReg[16], 10); // 第17位
	const gender = genderCode % 2 === 0 ? 2 : 1;
	return {
		birthDate: birthDate,
		age: getExactAgeByBirthday(birthDate),
		gender: gender
	};
}

/**
 * 根据身份证号获取精确周岁年龄
 * @param {Date} birthDate 
 * @returns {number} 周岁年龄
 */
function getExactAgeByBirthday(birthDate) {
	if (isNaN(birthDate.getDate())) {
		message.error('无效的出生日期格式');
	}
	// 获取今天的日期
	const today = new Date();
	// 获取今年的年份
	const currentYear = today.getFullYear();

	// 计算年龄
	let age = currentYear - birthDate.getFullYear();
	// 如果今年的生日还没到，年龄减一
	if (today.getMonth() < birthDate.getMonth() ||
		(today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}
/**
 * 获取所有机构列表
 * @returns 机构列表
 */
export const getOrganizations = () => {
	let data = [];
	const organizations = toJS(appStore.organizations)
	if (organizations.length > 0) {
		data = organizations;
	}
	return data;
}

/**
 * 身份证15位编码规则：dddddd yymmdd xx p dddddd：6位地区编码 yymmdd: 出生年(两位年)月日，如：910215 xx:
 * 顺序编码，系统产生，无法确定 p: 性别，奇数为男，偶数为女
 * 
 * 身份证18位编码规则：dddddd yyyymmdd xxx y dddddd：6位地区编码 yyyymmdd:
 * 出生年(四位年)月日，如：19910215 xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女 y: 校验码，该位数值可通过前17位计算获得
 * 
 * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ] 验证位
 * Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ] 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
 * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 ) i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
 */
export const validateIdCard = (idCard) => {
	// 身份证号码的正则表达式，匹配15位和18位
	const regIdCard = /^(?:[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[Xx0-9])|(?:[1-9]\d{5}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3})$/;
	// 校验身份证号码格式
	if (!regIdCard.test(idCard)) {
		return false;
	}
	// 校验身份证号码长度，18位身份证号码需要额外校验最后一位校验码
	if (idCard.length === 18) {
		const weightFactors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
		let sum = 0;
		for (let i = 0; i < 17; i++) {
			sum += parseInt(idCard[i], 10) * weightFactors[i];
		}
		const mod = sum % 11;
		const lastChar = idCard.toUpperCase().charAt(17);

		// 如果校验码是10，则身份证号码最后一位应该是X
		return (mod === 2 && lastChar === 'X') || (mod !== 2 && checkCodes[mod] === lastChar);
	}
	// 如果不是18位，直接返回true（15位身份证号码已通过正则校验）
	return true;
};

/**
 * 年级转换
 * @param {*} value 年级数字
 */
export const gradeTransition = (value) => {
	const grade = [
		{ label: '一年级', value: 1 },
		{ label: '二年级', value: 2 },
		{ label: '三年级', value: 3 },
		{ label: '四年级', value: 4 },
		{ label: '五年级', value: 5 },
		{ label: '六年级', value: 6 },
		{ label: '七年级', value: 7 },
		{ label: '八年级', value: 8 },
		{ label: '九年级', value: 9 },
		{ label: '高一', value: 10 },
		{ label: '高二', value: 11 },
		{ label: '高三', value: 12 }
	]
	let result = ""
	grade.forEach(item => {
		if (item.value == value) {
			result = item.label
		}
	})
	return result
}

/**
 * 获取中医体质辨识体质类型编码
 * @param {string} type - 体质类型
 * @returns {number} 体质类型编码
 */
export function getHealthGuidanceCode(type) {
    switch (type) {
        case "平和质":
            return 1;
        case "气虚质":
            return 2;
        case "阳虚质":
            return 3;
        case "阴虚质":
            return 4;
        case "痰湿质":
            return 5;
        case "湿热质":
            return 6;
        case "血瘀质":
            return 7;
        case "气郁质":
            return 8;
        case "特禀质":
            return 9;
        default:
            return 0;
    }
}