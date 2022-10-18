'use strict';

const path = require('path')
const Service = require('egg').Service;

class DrawService extends Service {
	async find(uid) {
		const user = await this.ctx.db.query(
			'select * from user where uid = ?',
			uid,
		);
		return user;
	}
	async header(canvasCtx, params, config) {
		const { ctx } = this;
		const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, drawImage } = ctx.helper;
		const { x, y, canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight } = config;

		// logo
		// const logo = path.join(__dirname, '../public/assets/image/', 'autostreets_logo.png');
		// await drawImage(canvasCtx, { x, y, width: 239, height: 78, src: logo });

		// 标题
		fillText(canvasCtx, { text: params.title, fontSize: '36px', fontWeight: 'bold', x: canvasWidth / 2, y: 29 + 25 });

		// 打印时间
		// fillText(canvasCtx, { text: '打印时间：', fontSize: '8px', x: sX, y: 32 + sY, textAlign: 'left' });
		// let text = canvasCtx.measureText('打印时间：');
		// fillText(canvasCtx, { text: params.printTimeString, fontSize: '8px', fontWeight: 'normal', color: '#666', x: canvasPadding + text.width, y: 32 + canvasPadding, textAlign: 'left' });

		// 编号
		fillText(canvasCtx, { text: params.orderNo, x: canvasWidth - canvasPadding, y: 78, textAlign: 'right' });
		const width = getWidth(canvasCtx, params.orderNo, '18px');
		fillText(canvasCtx, { text: '编号：', fontWeight: 'bold', x: canvasWidth - canvasPadding - width - 14, y: 78, textAlign: 'right' });
		fillLine(canvasCtx, { sX: canvasPadding, sY: 108, eX: canvasWidth - canvasPadding, eY: 108, color: '#666' });
		return 108;
	}
	// 多辆车时订单基本信息
	baseInfo(canvasCtx, params, config) {
		const { ctx } = this;
		const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, drawImage } = ctx.helper;
		let { x, y, canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight, indent, innerWidth, fontSize } = config;
		if (params.saleType === 1) { // 同步拍
			// 品牌型号
			fillText(canvasCtx, { text: '拍卖公司', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
			autoFillText(canvasCtx, { text: params.auctionCompany, width: cellWidth * 5 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y, paddingTop: 2, lineHeight: (cellHeight / 2), textAlign: 'left' });
			fillLine(canvasCtx, { sX: x + cellWidth * 8 - 1, sY: y, eX: x + cellWidth * 8 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: '拍卖会', x: x + cellWidth * 8 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 11 - 1, sY: y, eX: x + cellWidth * 11 - 1, eY: y + cellHeight });
			autoFillText(canvasCtx, { text: '2022年8月31日汽车街天津二手车拍卖会2022年8月31日汽车街天津二手车拍卖会', fontSize: fontSize + 'px', width: cellWidth * 5 - indent * 2, height: cellHeight, x: x + cellWidth * 11 + indent, y, paddingTop: 0, lineHeight: (cellHeight / 2), textAlign: 'left' });
			fillLine(canvasCtx, { sX: x + cellWidth * 16 - 1, sY: y, eX: x + cellWidth * 16 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: '买受人', x: x + cellWidth * 16 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 19 - 1, sY: y, eX: x + cellWidth * 19 - 1, eY: y + cellHeight });
			autoFillText(canvasCtx, { text: params.bidderName, width: cellWidth * 5 - indent * 2, height: cellHeight, x: x + cellWidth * 19 + indent, y, paddingTop: 2, lineHeight: (cellHeight / 2), textAlign: 'left' });
			fillLine(canvasCtx, { sX: x + cellWidth * 24 - 1, sY: y, eX: x + cellWidth * 24 - 1, eY: y + cellHeight });
			y = y + cellHeight;
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

			fillText(canvasCtx, { text: '成交总额', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.totalPriceString ? (`¥ ${params.totalPriceString}（大写）¥ ${params.totalPriceChinese}整`) : '', width: cellWidth * 13 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
			fillLine(canvasCtx, { sX: x + cellWidth * 16 - 1, sY: y, eX: x + cellWidth * 16 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: '车辆数', x: x + cellWidth * 16 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 19 - 1, sY: y, eX: x + cellWidth * 19 - 1, eY: y + cellHeight });
			autoFillText(canvasCtx, { text: '3 (具体信息参见附录)', width: cellWidth * 5 - indent * 2, height: cellHeight, x: x + cellWidth * 19 + indent, y, paddingTop: 2, lineHeight: (cellHeight / 2), textAlign: 'left' });
			fillLine(canvasCtx, { sX: x + cellWidth * 24 - 1, sY: y, eX: x + cellWidth * 24 - 1, eY: y + cellHeight });
			y = y + cellHeight;
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		} else {
			fillText(canvasCtx, { text: '买受人', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
			autoFillText(canvasCtx, { text: params.bidderName, width: cellWidth * 5 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y, paddingTop: 2, lineHeight: (cellHeight / 2), textAlign: 'left' });
			fillLine(canvasCtx, { sX: x + cellWidth * 8 - 1, sY: y, eX: x + cellWidth * 8 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: '车辆数', x: x + cellWidth * 8 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 11 - 1, sY: y, eX: x + cellWidth * 11 - 1, eY: y + cellHeight });
			autoFillText(canvasCtx, { text: '3 (具体信息参见附录)', width: cellWidth * 5 - indent * 2, height: cellHeight, x: x + cellWidth * 11 + indent, y, paddingTop: 2, lineHeight: (cellHeight / 2), textAlign: 'left' });
			fillLine(canvasCtx, { sX: x + cellWidth * 16 - 1, sY: y, eX: x + cellWidth * 16 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: '成交日期', x: x + cellWidth * 16 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 19 - 1, sY: y, eX: x + cellWidth * 19 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: '2022-09-09', x: x + cellWidth * 19 + indent, y: y + cellHeight / 2, textAlign: 'left' });

			y = y + cellHeight;
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

			fillText(canvasCtx, { text: '成交总额', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.totalPriceString ? (`¥ ${params.totalPriceString}（大写）¥ ${params.totalPriceChinese}整`) : '', width: cellWidth * 21 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
			y = y + cellHeight;
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		}

		// 交车时间
		fillText(canvasCtx, { text: '交车时间', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: '最迟不晚于买受人支付完毕全部款项后48小时内。 若买受人未在上述时间内提车的，后续车辆风险皆由买受人自行承担。', width: cellWidth * 21 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		return y;
	}

	// 单车时车辆信息
	singleCarInfo(canvasCtx, params, config) {
		const { ctx } = this;
		const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, drawImage } = ctx.helper;
		let { x, y, canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight, indent, innerWidth } = config;

		if (params.saleType === 1) { // 同步拍
			fillText(canvasCtx, { text: '拍卖会', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.auctionTitle, width: cellWidth * 21 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
			y = y + cellHeight;
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		}
		// 品牌型号
		fillText(canvasCtx, { text: '品牌型号', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
		const vechileNameX = x + cellWidth * 3 + indent;
		autoFillText(canvasCtx, { text: params.vechileNameAll, width: cellWidth * 21 - indent * 2, height: cellHeight, x: vechileNameX, y, paddingTop: 0, lineHeight: (cellHeight / 2), textAlign: 'left' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		if (params.saleType === 1) { // 同步拍
			// 拍卖公司
			fillText(canvasCtx, { text: '拍卖公司', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
			autoFillText(canvasCtx, { text: params.auctionCompany, width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y, paddingTop: 0, lineHeight: (cellHeight / 2), textAlign: 'left' });
			fillLine(canvasCtx, { sX: x + cellWidth * 12 - 1, sY: y, eX: x + cellWidth * 12 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: '买受人', x: x + cellWidth * 12 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 15 - 1, sY: y, eX: x + cellWidth * 15 - 1, eY: y + cellHeight });
			autoFillText(canvasCtx, { text: params.bidderName, width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 15 + indent, y, paddingTop: 0, lineHeight: (cellHeight / 2), textAlign: 'left' });
			y = y + cellHeight;
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		} else {
			fillText(canvasCtx, { text: '买受人', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
			autoFillText(canvasCtx, { text: params.bidderName, width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y, paddingTop: 0, lineHeight: (cellHeight / 2), textAlign: 'left' });
			fillLine(canvasCtx, { sX: x + cellWidth * 12 - 1, sY: y, eX: x + cellWidth * 12 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: '成交日期', x: x + cellWidth * 12 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
			fillLine(canvasCtx, { sX: x + cellWidth * 15 - 1, sY: y, eX: x + cellWidth * 15 - 1, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.bidderTimeString, width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 15 + indent, y: y + cellHeight / 2, textAlign: 'left' });
			y = y + cellHeight;
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		}

		// 原车牌号
		fillText(canvasCtx, { text: '原车牌号', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: params.licenseCode, width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		fillLine(canvasCtx, { sX: x + cellWidth * 12 - 1, sY: y, eX: x + cellWidth * 12 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: '车架号', x: x + cellWidth * 12 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 15 - 1, sY: y, eX: x + cellWidth * 15 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: params.vinCode, width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 15 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		// 成交车价
		fillText(canvasCtx, { text: '成交车价', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: params.finalPriceString ? (`¥ ${params.finalPriceString}`) : '', width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		fillLine(canvasCtx, { sX: x + cellWidth * 12 - 1, sY: y, eX: x + cellWidth * 12 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: '佣金', x: x + cellWidth * 12 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 15 - 1, sY: y, eX: x + cellWidth * 15 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: params.buyerCommissionFeeString ? (`¥ ${params.buyerCommissionFeeString}`) : '', width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 15 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		// 储运费
		fillText(canvasCtx, { text: '储运费', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: params.exWarehouseFeeString ? (`¥ ${params.exWarehouseFeeString}`) : '', width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		fillLine(canvasCtx, { sX: x + cellWidth * 12 - 1, sY: y, eX: x + cellWidth * 12 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: '交付服务费', x: x + cellWidth * 12 + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 15 - 1, sY: y, eX: x + cellWidth * 15 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: params.deliveryFeeString ? (`¥ ${params.deliveryFeeString}`) : '', width: cellWidth * 9 - indent * 2, height: cellHeight, x: x + cellWidth * 15 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		// 成交总额
		fillText(canvasCtx, { text: '成交总额', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: params.totalTurnoverPriceString ? (`¥ ${params.totalTurnoverPriceString}（大写）¥ ${params.totalTurnoverPriceChinese}整`) : '', width: cellWidth * 21 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		// 交车时间
		fillText(canvasCtx, { text: '交车时间', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: '最迟不晚于买受人支付完毕全部款项后48小时内。 若买受人未在上述时间内提车的，后续车辆风险皆由买受人自行承担。', width: cellWidth * 21 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		return y;
	}
	// 增值服务 部分
	async valueAddedService(canvasCtx, params, config) {
		const { ctx } = this;
		const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, drawImage } = ctx.helper;
		let { x, y, canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight, indent, innerWidth } = config;
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		fillText(canvasCtx, { text: '本人/公司同意选择汽车街提供如下增值服务：', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		if (params.licenseFeeString > 0) {
			const checkbox = path.join(__dirname, '../public/assets/image/', 'checkbox.png');
			await drawImage(canvasCtx, { x: x + indent, y: y + 18, width: 16, height: 16, src: checkbox });
		}
		fillText(canvasCtx, { text: '办证服务', x: x + indent + 22, y: y + cellHeight / 2, textAlign: 'left', });
		fillLine(canvasCtx, { sX: x + cellWidth * 4 - 1, sY: y, eX: x + cellWidth * 4 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: '办证费', x: x + cellWidth * 4 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		fillLine(canvasCtx, { sX: x + cellWidth * 8 - 1, sY: y, eX: x + cellWidth * 8 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: params.licenseFeeString ? (`¥ ${params.licenseFeeString}`) : '', x: x + cellWidth * 8 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		fillLine(canvasCtx, { sX: x + cellWidth * 12 - 1, sY: y, eX: x + cellWidth * 12 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: '本人/公司已阅读并同意', x: x + cellWidth * 12 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		const width = getWidth(canvasCtx, '本人/公司已阅读并同意', '18px');
		fillText(canvasCtx, { text: '《汽车街办证服务合同》', x: x + cellWidth * 12 + indent + width, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		fillText(canvasCtx, { text: '若选择汽车街提供增值服务的，本人/公司将在办理完毕前述提车手续后将车辆继续存放汽车街。', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		return y;
	}

	// 交易总额信息
	totalPrice(canvasCtx, params, config) {
		const { ctx } = this;
		const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, drawImage } = ctx.helper;
		let { x, y, canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight, indent, innerWidth } = config;
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		fillText(canvasCtx, { text: '交易总额', x: x + indent, y: y + cellHeight / 2, textAlign: 'left', fontWeight: 'bold' });
		fillLine(canvasCtx, { sX: x + cellWidth * 3 - 1, sY: y, eX: x + cellWidth * 3 - 1, eY: y + cellHeight });
		fillText(canvasCtx, { text: params.totalPriceString ? (`¥ ${params.totalPriceString}（大写）¥ ${params.totalPriceChinese}整`) : '', width: cellWidth * 21 - indent * 2, height: cellHeight, x: x + cellWidth * 3 + indent, y: y + cellHeight / 2, textAlign: 'left' });
		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		const lineHeight = 32;
		// 说明文本
		y = y + 10 + lineHeight / 2;
		fillText(canvasCtx, { text: '本人/本公司竞买前已知悉竞买车辆的现状，且了解车辆详情仅供参考。本人/本公司签署本《成交确认单》即表明对竞买车辆的现状（包', x: x + indent + 36, y, textAlign: 'left' });
		y = y + lineHeight;
		fillText(canvasCtx, { text: '括但不限于车辆外观、内饰现状、车辆机械运行状态、车辆维修记录、保险记录等）及竞买程序无任何异议，并予以确认。本人/本公司提车', x: x + indent, y, textAlign: 'left' });
		y = y + lineHeight;
		fillText(canvasCtx, { text: '后，不以车况不符向拍卖人及委托方主张任何权益。 ', x: x + indent, y, textAlign: 'left' });
		y = y + lineHeight;
		fillText(canvasCtx, { text: '本人/公司确保付款银行账户为本人/本公司账户，即付款账户名与买受人一致；若非买受人账户支付款项，“汽车街”有权将收到的成交', x: x + indent + 36, y, textAlign: 'left' });
		y = y + lineHeight;
		fillText(canvasCtx, { text: '车款及其他费用原路全额退还。若本人/本公司未在约定期限内支付成交车款及其他费用的，构成违约，本人/本公司缴纳的交易保证金将作违', x: x + indent, y, textAlign: 'left' });
		y = y + lineHeight;
		fillText(canvasCtx, { text: '约金。', x: x + indent, y, textAlign: 'left' });
		y = y + lineHeight / 2 + 10;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		return y;
	}
	// 同步拍签字部分
	async syncAuctionSign(canvasCtx, params, config) {
		const { ctx } = this;
		const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, drawImage } = ctx.helper;
		let { x, y, canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight, indent, innerWidth } = config;
		fillLine(canvasCtx, { sX: x + cellWidth * 3.5 - 1, sY: y, eX: x + cellWidth * 3.5 - 1, eY: y + 200 });
		fillLine(canvasCtx, { sX: x + cellWidth * 12 - 1, sY: y, eX: x + cellWidth * 12 - 1, eY: y + 200 });
		fillLine(canvasCtx, { sX: x + cellWidth * 15.5 - 1, sY: y, eX: x + cellWidth * 15.5 - 1, eY: y + 200 });
		fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 12, sY: y + 153, eX: innerWidth + canvasPadding, eY: y + 153 });
		fillText(canvasCtx, { text: '拍卖公司', x: canvasPadding + cellWidth * 3.5 / 2, y: y + 68 + 16, textAlign: 'center', fontWeight: 'bold' });
		fillText(canvasCtx, { text: '（盖章）', x: canvasPadding + cellWidth * 3.5 / 2, y: y + 68 + 32 + 10, textAlign: 'center', fontWeight: 'bold' });
		fillText(canvasCtx, { text: '买受人/经办人', x: canvasPadding + cellWidth * 12 + cellWidth * 3.5 / 2, y: y + 45 + 16, textAlign: 'center', fontWeight: 'bold' });
		fillText(canvasCtx, { text: '（签字）', x: canvasPadding + cellWidth * 12 + cellWidth * 3.5 / 2, y: y + 45 + 32 + 10, textAlign: 'center', fontWeight: 'bold' });
		if (params.signUrl) {
			const signImg = params.signUrl.indexOf('data:image/') > -1 ? params.signUrl : ('http://images.autostreets.com/' + params.signUrl);
			await drawImage(canvasCtx, { x: cellWidth * 15.5 + 141 + 20, y: y + 43, width: 136, height: 68, src: signImg });
		}
		fillText(canvasCtx, { text: '日期', x: canvasPadding + cellWidth * 12 + cellWidth * 3.5 / 2, y: y + 155 + 20, textAlign: 'center', fontWeight: 'bold' });
		fillText(canvasCtx, { text: params.signDateString, x: canvasPadding + cellWidth * 15.5 + cellWidth * 8.5 / 2, y: y + 155 + 20, textAlign: 'center'});
		y = y + 200;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		return y;
	}
	// 非同步拍签字
	async otherAuctionSign(canvasCtx, params, config) {
		const { ctx } = this;
		const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, drawImage } = ctx.helper;
		let { x, y, canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight, indent, innerWidth } = config;
		const tabeleCellHeight = 112;
		fillLine(canvasCtx, { sX: x + cellWidth * 3.5 - 1, sY: y, eX: x + cellWidth * 3.5 - 1, eY: y + tabeleCellHeight });
		fillLine(canvasCtx, { sX: x + cellWidth * 12 - 1, sY: y, eX: x + cellWidth * 12 - 1, eY: y + tabeleCellHeight });
		fillLine(canvasCtx, { sX: x + cellWidth * 15.5 - 1, sY: y, eX: x + cellWidth * 15.5 - 1, eY: y + tabeleCellHeight });
		fillText(canvasCtx, { text: '买受人/经办人', x: canvasPadding + cellWidth * 3.5 / 2, y: y + 24 + 16, textAlign: 'center', fontWeight: 'bold' });
		fillText(canvasCtx, { text: '（签字）', x: canvasPadding + cellWidth * 3.5 / 2, y: y + 24 + 32 + 10, textAlign: 'center', fontWeight: 'bold' });
		if (params.signUrl) {
			const signImg = params.signUrl.indexOf('data:image/') > -1 ? params.signUrl : ('http://images.autostreets.com/' + params.signUrl);
			await drawImage(canvasCtx, { x: cellWidth * 3.5 + 141 + 20, y: y + 22, width: 136, height: 68, src: signImg });
		}
		fillText(canvasCtx, { text: '日期', x: canvasPadding + cellWidth * 12 + cellWidth * 3.5 / 2, y: y + 36 + 16, textAlign: 'center', fontWeight: 'bold' });
		fillText(canvasCtx, { text: params.signDateString, x: canvasPadding + cellWidth * 15.5 + cellWidth * 8.5 / 2, y: y + 36 + 16, textAlign: 'center'});

		y = y + tabeleCellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		return y;
	}

	// 多车车辆信息
	carList(canvasCtx, params, config) {
		const { ctx } = this;
		const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, getLines } = ctx.helper;
		let { x, y, canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight, indent, innerWidth } = config;
		y = y + cellHeight;
		const tableSy = y, tableCellHeight = 176, tableFontSize = '16px';
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		fillText(canvasCtx, { text: '序号', x: x + cellWidth * 1.5 / 2, y: y + cellHeight / 2, fontWeight: 'bold' });
		fillText(canvasCtx, { text: '车辆信息', x: x + cellWidth * 1.5 + cellWidth * 6.5 / 2, y: y + cellHeight / 2, fontWeight: 'bold' });
		fillText(canvasCtx, { text: '成交总额', x: x + cellWidth * 8 + cellWidth * 3 / 2, y: y + cellHeight / 2, fontWeight: 'bold' });
		fillText(canvasCtx, { text: '成交车价', x: x + cellWidth * 11 + cellWidth * 3 / 2, y: y + cellHeight / 2, fontWeight: 'bold' });
		fillText(canvasCtx, { text: '佣金', x: x + cellWidth * 14 + cellWidth * 2.5 / 2, y: y + cellHeight / 2, fontWeight: 'bold' });
		fillText(canvasCtx, { text: '储运费', x: x + cellWidth * 16.5 + cellWidth * 2.5 / 2, y: y + cellHeight / 2, fontWeight: 'bold' });
		fillText(canvasCtx, { text: '办证费', x: x + cellWidth * 19 + cellWidth * 2.5 / 2, y: y + cellHeight / 2, fontWeight: 'bold' });
		fillText(canvasCtx, { text: '交付服务费', x: x + cellWidth * 21.5 + cellWidth * 2.5 / 2, y: y + cellHeight / 2, fontWeight: 'bold' });

		y = y + cellHeight;
		fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });

		// 绘制车辆信息单元格
		function renderCarInfo() {
			let _y = y + 10;
			const lh = 20;
			const lineSpace = 20;
			fillText(canvasCtx, { text: '订单编号：3722092318574410', x: x + cellWidth * 1.5 + indent, y: _y + lh / 2, fontSize: tableFontSize, textAlign: 'left' });
			_y += lineSpace + lh;
			const car = '品牌型号：奔驰 C级 2018款 C 180 L 1.6T 手自一体 时尚型运动版品牌型号：奔驰 C级 2018款 C 180 L 1.6T 手自一体 时尚型运动版';
			const lines = getLines(canvasCtx, car, '16px', 276);
			fillTextWarp(canvasCtx, { text: car, x: x + cellWidth * 1.5 + indent, y: _y, width: 276, fontSize: tableFontSize, textAlign: 'left', lineHeight: lh });
			_y += lines * lh;
			fillText(canvasCtx, { text: '原车牌号：渝AC63U6', x: x + cellWidth * 1.5 + indent, y: _y + 10, fontSize: tableFontSize, textAlign: 'left' });
			_y += lh + 5;
			fillText(canvasCtx, { text: '车架号：LS5A3DBE6DA223653', x: x + cellWidth * 1.5 + indent, y: _y + lh / 2, fontSize: tableFontSize, textAlign: 'left' });

		}
		[ '111', 2, 3, 4, 5,6 ,78,8,2,2,2,2,2 ].forEach((item, index) => {
			fillText(canvasCtx, { text: index + 1, x: x + cellWidth * 1.5 / 2, y: y + tableCellHeight / 2, fontSize: tableFontSize });
			renderCarInfo();
			fillText(canvasCtx, { text: '¥189,300', x: x + cellWidth * 11 - indent, y: y + tableCellHeight / 2, textAlign: 'right', fontSize: tableFontSize });
			fillText(canvasCtx, { text: '¥9,189,300', x: x + cellWidth * 14 - indent, y: y + tableCellHeight / 2, textAlign: 'right', fontSize: tableFontSize });
			fillText(canvasCtx, { text: '¥9,189,300', x: x + cellWidth * 16.5 - indent, y: y + tableCellHeight / 2, textAlign: 'right', fontSize: tableFontSize });
			fillText(canvasCtx, { text: '¥9,189,300', x: x + cellWidth * 19 - indent, y: y + tableCellHeight / 2, textAlign: 'right', fontSize: tableFontSize });
			fillText(canvasCtx, { text: '¥9,189,300', x: x + cellWidth * 21.5 - indent, y: y + tableCellHeight / 2, textAlign: 'right', fontSize: tableFontSize });
			fillText(canvasCtx, { text: '¥9,189,300', x: x + cellWidth * 24 - indent, y: y + tableCellHeight / 2, textAlign: 'right', fontSize: tableFontSize });
			y += tableCellHeight;
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth + canvasPadding, eY: y });
		});
		fillLine(canvasCtx, { sX: x + cellWidth * 1.5 - 1, sY: tableSy, eX: x + cellWidth * 1.5 - 1, eY: y });
		fillLine(canvasCtx, { sX: x + cellWidth * 8 - 1, sY: tableSy, eX: x + cellWidth * 8 - 1, eY: y });
		fillLine(canvasCtx, { sX: x + cellWidth * 11 - 1, sY: tableSy, eX: x + cellWidth * 11 - 1, eY: y });
		fillLine(canvasCtx, { sX: x + cellWidth * 14 - 1, sY: tableSy, eX: x + cellWidth * 14 - 1, eY: y });
		fillLine(canvasCtx, { sX: x + cellWidth * 16.5 - 1, sY: tableSy, eX: x + cellWidth * 16.5 - 1, eY: y });
		fillLine(canvasCtx, { sX: x + cellWidth * 19 - 1, sY: tableSy, eX: x + cellWidth * 19 - 1, eY: y });
		fillLine(canvasCtx, { sX: x + cellWidth * 21.5 - 1, sY: tableSy, eX: x + cellWidth * 21.5 - 1, eY: y });

		return y;
	}
}

module.exports = DrawService;
