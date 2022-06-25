'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const { promisify } = require('util');
const { createCanvas, registerFont } = require('canvas');
registerFont(path.join(__dirname, '../public/assets/fonts/MSYH.TTF'), { family: 'MSYH' });
registerFont(path.join(__dirname, '../public/assets/fonts/MSYHBD.TTF'), { family: 'MSYHBD' });

class HomeController extends Controller {
	async index() {
		const { ctx } = this;
		ctx.body = 'hi, egg';
	}

	async draw() {
		const { ctx } = this;
		ctx.logger.info('request=>', ctx.request.body);
		const params = ctx.request.body;
		try {
			const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, drawImage } = ctx.helper;
			// console.log(ctx.request.body);

			// 图片放大倍数
			const multiple = params.multiple || 2;
			// 设备像素比
			let { ratio } = params;
			ratio = ratio * multiple;
			const canvasWidth = 680;// 图片宽度
			const canvasPadding = 5;// 内边距
			const canvasHeight = 290;// 高度
			const innerWidth = canvasWidth - canvasPadding * 2;// 内容区宽度
			const canvas = createCanvas(canvasWidth * ratio, canvasHeight * ratio);
			const canvasCtx = canvas.getContext('2d');
			// 画布白色背景
			canvasCtx.scale(ratio, ratio);
			canvasCtx.fillStyle = '#fff';
			canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

			const cellHeight = 22;// 单元格高度
			const cellWidth = canvasWidth / 6;

			// logo
			const logo = path.join(__dirname, '../public/assets/image/', 'autostreets_logo.png');
			await drawImage(canvasCtx, { x: canvasPadding, y: canvasPadding, width: 117.5, height: 26, src: logo });

			// 标题
			fillText(canvasCtx, { text: params.title, fontSize: '14px', x: canvasWidth / 2, y: 12 });

			// 打印时间
			fillText(canvasCtx, { text: '打印时间：', fontSize: '8px', x: canvasPadding, y: 32 + canvasPadding, textAlign: 'left' });
			let text = canvasCtx.measureText('打印时间：');
			fillText(canvasCtx, { text: params.printTimeString, fontSize: '8px', fontWeight: 'normal', color: '#666', x: canvasPadding + text.width, y: 32 + canvasPadding, textAlign: 'left' });

			// 编号
			fillText(canvasCtx, { text: params.orderNo, fontSize: '8px', fontWeight: 'normal', color: '#666', x: canvasWidth - canvasPadding - 5, y: 32 + canvasPadding, textAlign: 'right' });
			text = canvasCtx.measureText(params.orderNo);
			fillText(canvasCtx, { text: '编号：', fontSize: '8px', color: '#000', x: canvasWidth - canvasPadding - text.width - 5, y: 32 + canvasPadding, textAlign: 'right' });

			// 每行起点 y坐标
			// 第一行
			let y = 50;
			const filedNameSize = '10px';// 字段名 字号
			const filedValueSize = '9px';// 值 字号
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });
			if (params.saleType === 1) { // 1 同步拍, 2: '在线拍',3: '即时拍',4: '联合拍',5: '全网拍', 6: '专场拍'
				// 拍卖会
				fillText(canvasCtx, { text: '拍卖会', fontSize: filedNameSize, x: cellWidth / 2 + canvasPadding, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.auctionTitle, fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth + 10, y: y + (cellHeight / 2), textAlign: 'left' });

				y += cellHeight;
				// 第二行
				fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });
				// 拍品序号
				fillText(canvasCtx, { text: '拍品序号', fontSize: filedNameSize, x: canvasPadding + cellWidth / 2, y: y + 30 / 2 });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + 30 });
				fillText(canvasCtx, { text: params.auctionVehicleOrder, fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth + (cellWidth / 2), y: y + 30 / 2 });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 2, sY: y, eX: canvasPadding + cellWidth * 2, eY: y + 45 });
				// 品牌型号
				fillText(canvasCtx, { text: '品牌型号', fontSize: filedNameSize, x: canvasPadding + cellWidth * 2 + cellWidth / 2, y: y + 30 / 2 });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 3, sY: y, eX: canvasPadding + cellWidth * 3, eY: y + 30 });
				const vechileNameX = canvasPadding + cellWidth * 3 + (cellWidth * 3) / 2 - 10;
				autoFillText(canvasCtx, { text: params.vechileNameAll, fontSize: filedValueSize, color: '#666', width: cellWidth * 3 - 30, height: 30, x: vechileNameX, y, paddingTop: 5, lineHeight: (cellHeight / 2) });

				y += 30;
			} else {
				// 品牌型号
				fillText(canvasCtx, { text: '品牌型号', fontSize: filedNameSize, x: cellWidth / 2 + canvasPadding, y: y + 25 / 2 });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + 25 });
				const vechileNameX = canvasPadding + cellWidth + 10;
				autoFillText(canvasCtx, { text: params.vechileNameAll, fontSize: filedValueSize, color: '#666', width: cellWidth * 5 - 20, height: 25, x: vechileNameX, y, textAlign: 'left' });
				
				y += 25;
				// 第二行
				fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });
				fillText(canvasCtx, { text: '成交日期', fontSize: filedNameSize, x: cellWidth / 2 + canvasPadding, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.bidderTimeString, fontSize: filedValueSize, x: canvasPadding + cellWidth + cellWidth / 2, y: y + (cellHeight / 2) + 1, color: '#666' });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 2, sY: y, eX: canvasPadding + cellWidth * 2, eY: y + cellHeight });
				fillText(canvasCtx, { text: '竞拍城市', fontSize: filedNameSize, x: canvasPadding + cellWidth * 2 + cellWidth / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 3, sY: y, eX: canvasPadding + cellWidth * 3, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.city, fontSize: filedValueSize, x: canvasPadding + cellWidth * 3 + 10, y: y + (cellHeight / 2), color: '#666', textAlign: 'left' });
				y += cellHeight;
			}

			// 第三行
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });
			// 原车牌号
			fillText(canvasCtx, { text: '原车牌号', fontSize: filedNameSize, x: canvasPadding + cellWidth / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.licenseCode, fontSize: filedValueSize, x: canvasPadding + cellWidth + cellWidth / 2, y: y + (cellHeight / 2), color: '#666' });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 2, sY: y, eX: canvasPadding + cellWidth * 2, eY: y + cellHeight });
			// 车架号
			fillText(canvasCtx, { text: '车架号', fontSize: filedNameSize, x: canvasPadding + cellWidth * 2 + cellWidth / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 3, sY: y, eX: canvasPadding + cellWidth * 3, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.vinCode, fontSize: filedValueSize, x: canvasPadding + cellWidth * 3 + 10, y: y + (cellHeight / 2) + 1, textAlign: 'left', color: '#666' });

			y += cellHeight;
			// 第四行
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });
			// 成交价
			fillText(canvasCtx, { text: '成交价', fontSize: filedNameSize, x: canvasPadding + cellWidth / 2, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.finalPriceString ? (`¥ ${params.finalPriceString}`) : '', fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth + cellWidth / 2, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 2, sY: y, eX: canvasPadding + cellWidth * 2, eY: y + cellHeight });
			// 佣金类型
			fillText(canvasCtx, { text: '佣金类型', fontSize: filedNameSize, x: canvasPadding + cellWidth * 2 + cellWidth / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 3, sY: y, eX: canvasPadding + cellWidth * 3, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.commissionType, fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth * 3 + cellWidth / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 4, sY: y, eX: canvasPadding + cellWidth * 4, eY: y + cellHeight });
			// 佣金
			fillText(canvasCtx, { text: '佣金', fontSize: filedNameSize, x: canvasPadding + cellWidth * 4 + cellWidth / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 5, sY: y, eX: canvasPadding + cellWidth * 5, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.buyerCommissionFeeString ? (`¥ ${params.buyerCommissionFeeString}`) : '', fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth * 5 + cellWidth / 2 - 4, y: y + (cellHeight / 2) + 1 });

			// 第五行
			y += cellHeight;
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });

			// 成交总额
			fillText(canvasCtx, { text: '成交总额', fontSize: filedNameSize, x: canvasPadding + cellWidth / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.totalPriceString ? (`¥ ${params.totalPriceString}`) : '', fontSize: filedValueSize, color: '#666', x: 5 + cellWidth + cellWidth / 2, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 2, sY: y, eX: canvasPadding + cellWidth * 2, eY: y + cellHeight });
			fillText(canvasCtx, { text: '办证费', fontSize: filedNameSize, x: 5 + cellWidth * 2 + cellWidth / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 3, sY: y, eX: canvasPadding + cellWidth * 3, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.licenseFeeString ? (`¥ ${params.licenseFeeString}`) : '', fontSize: filedValueSize, color: '#666', x: 5 + cellWidth * 3 + cellWidth / 2, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 4, sY: y, eX: canvasPadding + cellWidth * 4, eY: y + cellHeight });
			fillText(canvasCtx, { text: '储运费', fontSize: filedNameSize, x: canvasPadding + cellWidth * 4 + cellWidth / 2, y: y + (cellHeight / 2) });
			fillText(canvasCtx, { text: params.exWarehouseFeeString ? (`¥ ${params.exWarehouseFeeString}`) : '', fontSize: filedValueSize, color: '#666', x: 5 + cellWidth * 5 + cellWidth / 2 - 4, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 5, sY: y, eX: canvasPadding + cellWidth * 5, eY: y + cellHeight });

			y += cellHeight;
			// 第六行
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });
			// 成交总额（大写）
			fillText(canvasCtx, { text: '成交总额', fontSize: filedNameSize, x: canvasPadding + cellWidth / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.totalPriceChinese ? `（大写）¥ ${params.totalPriceChinese}整` : '', fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth + 10, y: y + (cellHeight / 2), textAlign: 'left' });

			y += cellHeight;
			// 第七行
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });
			if (params.saleType === 1) {
				// 成交号牌
				fillText(canvasCtx, { text: '成交号牌', fontSize: filedNameSize, x: canvasPadding + cellWidth / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.auctionNumber, fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth + (cellWidth) / 2, y: y + (cellHeight / 2) + 1 });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 2, sY: y, eX: canvasPadding + cellWidth * 2, eY: y + cellHeight });
				fillText(canvasCtx, { text: '登记姓名', fontSize: filedNameSize, x: canvasPadding + cellWidth * 2 + cellWidth / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 3, sY: y, eX: canvasPadding + cellWidth * 3, eY: y + cellHeight });
				autoFillText(canvasCtx, { text: params.bidderName, fontSize: filedValueSize, color: '#666', width: cellWidth - 10, height: cellHeight, x: canvasPadding + cellWidth * 3 + (cellWidth) / 2, y });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 4, sY: y, eX: canvasPadding + cellWidth * 4, eY: y + cellHeight });
				// 开单人
				fillText(canvasCtx, { text: '开单人', fontSize: filedNameSize, x: canvasPadding + cellWidth * 4 + cellWidth / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 5, sY: y, eX: canvasPadding + cellWidth * 5, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.operator, fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth * 5 + cellWidth / 2 - 4, y: y + (cellHeight / 2) });
			} else {
				// 买受人
				fillText(canvasCtx, { text: '买受人', fontSize: filedNameSize, x: canvasPadding + cellWidth / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: y, eX: canvasPadding + cellWidth, eY: y + cellHeight });
				autoFillText(canvasCtx, { text: `${params.bidderName || '-'}（${params.idCardNum || '-'} ）`, fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth + (cellWidth * 3) / 2, y, height: cellHeight, width: cellWidth * 3 - 10 });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 4, sY: y, eX: canvasPadding + cellWidth * 4, eY: y + cellHeight });
				// 开单人
				fillText(canvasCtx, { text: '开单人', fontSize: filedNameSize, x: canvasPadding + cellWidth * 4 + cellWidth / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: canvasPadding + cellWidth * 5, sY: y, eX: canvasPadding + cellWidth * 5, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.operator, fontSize: filedValueSize, color: '#666', x: canvasPadding + cellWidth * 5 + cellWidth / 2 - 4, y: y + (cellHeight / 2) });
			}

			y += cellHeight;
			// 第八行
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });
			const tipsFontSize = '6px';
			const tipsLineHeight = 10;
			console.log(getWidth(canvasCtx, '人提车后，不以车况不符向贵方及委托方主张任何权益。支付成交价款的银行账户信息应与买受人参拍账号信息一致，即姓名、身份证等为同一人，若非同一人账户支付价款，将被原路全额退还，', '6px'));
			// 说明
			fillTextWarp(
				canvasCtx,
				{
					text: '本人竞买前已知悉竞买车辆的现状，且了解车辆详情仅供本人参考。本人签署本“成交确认单”即表明对竞买车辆的现状',
					x: canvasPadding + 5 + 1,
					y: y + 8,
					textAlign: 'left',
					width: 352,
					fontSize: tipsFontSize,
					fontWeight: 'normal',
					lineHeight: tipsLineHeight
				}
			);

			fillTextWarp(
				canvasCtx,
				{
					text: '（包括但不限于车辆外观、内饰现状、车辆机械运行状态、车辆维修记录、保险记录等）及竞买程序无任何异议，并予以确认。',
					x: canvasPadding + 5 + 1 + 317,
					y: y + 8,
					textAlign: 'left',
					width: 352,
					fontSize: tipsFontSize,
					underline: true,
					lineHeight: tipsLineHeight
				}
			);

			fillTextWarp(
				canvasCtx,
				{
					text: '本人提车后，不以车况不符向贵方及委托方主张任何权益。支付成交价款的银行账户信息应与买受人参拍账号信息一致，即姓名、身份证等为同一人，若非同一人账户支付价款，将被原路全额退还，',
					x: canvasPadding + 5 + 1,
					y: y + 8 + tipsLineHeight,
					textAlign: 'left',
					width: 555,
					fontSize: tipsFontSize,
					underline: true,
					lineHeight: tipsLineHeight
				}
			);

			fillTextWarp(
				canvasCtx,
				{
					text: '超过约定支付期限者视作违规，保证金作违约金不',
					x: canvasPadding + 5 + 1 + 522,
					y: y + 8 + tipsLineHeight,
					textAlign: 'left',
					width: 352,
					fontSize: tipsFontSize,
					fontWeight: 'normal',
				}
			);

			fillTextWarp(
				canvasCtx,
				{
					text: '予退还。',
					x: canvasPadding + 5 + 1,
					y: y + 8 + tipsLineHeight * 2,
					textAlign: 'left',
					width: 352,
					fontSize: tipsFontSize,
					fontWeight: 'normal',
				}
			);

			y = y + 8 + tipsLineHeight * 3 - 2;
			// 左外边框
			fillLine(canvasCtx, { sX: canvasPadding, sY: 50, eX: canvasPadding, eY: y });
			// 右外边框
			fillLine(canvasCtx, { sX: innerWidth, sY: 50, eX: innerWidth, eY: y });
			// 下外边框
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });

			// 买受人签字
			fillText(canvasCtx, { text: '买受人签字：', x: canvasPadding, y: y + 12, textAlign: 'left' });
			// 签名图
			if (params.signUrl) {
				const signImg = params.signUrl.indexOf('data:image/') > -1 ? params.signUrl : ('http://images.autostreets.com/' + params.signUrl);
				await drawImage(canvasCtx, { x: 5 + 58, y: y + 4, width: 54, height: 28, src: signImg });
			}
			// 日期
			fillText(canvasCtx, { text: '日期：', x: 202, y: y + 12, textAlign: 'left' });
			fillText(canvasCtx, { text: params.signDateString, x: 232, y: y + 12, textAlign: 'left', color: '#666' });
			fillText(canvasCtx, { text: '注意：本成交确认单涂改无效', x: canvasWidth - canvasPadding - 5, y: y + 12, textAlign: 'right' });
			// console.log('height=>', y + 6 + 15);
			ctx.body = {
				code: 0,
				data: await promisify(canvas.toDataURL).call(canvas, 'image/jpg', 1)
			};
			ctx.logger.info(params.orderNo + '成功');
		} catch (e) {
			ctx.logger.warn(`request-err=>${params.orderNo}`, e);
			ctx.body = {
				code: 999,
				data: null,
				message: '系统错误'
			};
		}
	}
}

module.exports = HomeController;
