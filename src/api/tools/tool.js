//日期格式化
let formartDate = function(date, fmt) {
	if(date == undefined || date == null||date.toString().trim().length<=0) {
		return "";
	}
  if(typeof date === 'string'){
    date = new Date(date);
  }
  date = date == undefined ? new Date() : date;
  date = typeof date == 'number' ? new Date(date) : date;
	fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
	var obj = {
		'y': date.getFullYear(), // 年份，注意必须用getFullYear
		'M': date.getMonth() + 1, // 月份，注意是从0-11
		'd': date.getDate(), // 日期
		'q': Math.floor((date.getMonth() + 3) / 3), // 季度
		'w': date.getDay(), // 星期，注意是0-6
		'H': date.getHours(), // 24小时制
		'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
		'm': date.getMinutes(), // 分钟
		's': date.getSeconds(), // 秒
		'S': date.getMilliseconds() // 毫秒
	};
	var week = ['天', '一', '二', '三', '四', '五', '六'];
	for(var i in obj) {
		fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
			var val = obj[i] + '';
			if(i == 'w') return(m.length > 2 ? '星期' : '周') + week[val];
			for(var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
			return m.length == 1 ? val : val.substring(val.length - m.length);
		});
	}
	return fmt;
};
/**
 * 获取当月时间
 * @param date
 * @returns {*[]}
 */
let getMonthString = function(date){
	let fullYear = date.getFullYear();
	let month = date.getMonth()+1;
	// let endOfMonth = new Date(fullYear,month,0);
	// let startOfMonth = new Date(date.setDate(1));
	let endOfMonth = new Date();
	let startOfMonth = new Date(fullYear,date.getMonth()-1,date.getDate());

	//此时可以获取到月初和月末的标准时间格式，想要转化为年月日，则需要使用上面的函数了
	let startTime = getDataString(startOfMonth);
	let endTime = getDataString(endOfMonth);
	return [startTime,endTime];
};
/**
 * 拼接时间字符串
 * @param date
 * @returns {string}
 */
let getDataString= function(date){
	let year = date.getFullYear().toString().padStart(4,'0');
	let month = (date.getMonth()+1).toString().padStart(2,'0');
	let day = date.getDate().toString().padStart(2,'0');
	return `${year}-${month}-${day}`;
};
/**
 * 将数字转为中文
 * @param num
 * @returns {string}
 */
let changeNumToHan= function(num) {
	let arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
	let arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'];//可继续追加更高位转换值
	if (!num || isNaN(num)) {
		return "零";
	}
	let english = num.toString().split("");
	let result = "";
	for (var i = 0; i < english.length; i++) {
		var des_i = english.length - 1 - i;//倒序排列设值
		result = arr2[i] + result;
		var arr1_index = english[des_i];
		result = arr1[arr1_index] + result;
	}
	//将【零千、零百】换成【零】 【十零】换成【十】
	result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
	//合并中间多个零为一个零
	result = result.replace(/零+/g, '零');
	//将【零亿】换成【亿】【零万】换成【万】
	result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
	//将【亿万】换成【亿】
	result = result.replace(/亿万/g, '亿');
	//移除末尾的零
	result = result.replace(/零+$/, '');
	//将【零一十】换成【零十】
	//result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
	//将【一十】换成【十】
	result = result.replace(/^一十/g, '十');
	return result;
};
/**
 * 生成uuid
 * @returns {string}
 */
let guid = function () {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + S4() + S4()  + S4() + S4() + S4() + S4());
}

//分组
let groupBy = (list, fn) => {
	const groups = {};
	list.forEach(function (o) {
		const group = JSON.stringify(fn(o));
		groups[group] = groups[group] || [];
		groups[group].push(o);
	});
	// return Object.keys(groups).map(function (group) {
	//     return groups[group];
	// });
	return groups;
}
export {formartDate,getMonthString,getDataString,changeNumToHan,guid,groupBy};
