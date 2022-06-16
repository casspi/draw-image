'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const { promisify } = require('util');
const { createCanvas, Image, registerFont } = require('canvas');
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
		try {
			const { fillText, autoFillText, fillTextWarp, getLines, fillLine, getWidth } = ctx.helper;
			// console.log(ctx.request.body);
			const params = ctx.request.body;

			// 图片放大倍数
			const multiple = params.multiple || 2;
			// 设备像素比
			let { ratio, saleType } = params;
			ratio = ratio * multiple;
			const canvasHeight = saleType === 1 ? 290 : 280;
			const canvas = createCanvas(375 * ratio, canvasHeight * ratio);
			const canvasCtx = canvas.getContext('2d');
			// 画布白色背景
			canvasCtx.scale(ratio, ratio);
			canvasCtx.fillStyle = '#fff';
			canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

			const cellHeight = 22;//单元格高度

			// logo
			const logo = path.join(__dirname, '../public/assets/image/', 'autostreets_logo.png');
			const img = new Image();
			img.onload = () => canvasCtx.drawImage(img, 5, 5, 76, 17);
			img.onerror = err => { throw err; };
			img.src = logo;

			// 标题
			fillText(canvasCtx, { text: params.title, x: 375 / 2, y: 10 });

			// 打印时间
			fillText(canvasCtx, { text: '打印时间：', fontSize: '8px', x: 5, y: 27 + 5, textAlign: 'left' });
			let text = canvasCtx.measureText('打印时间：');
			fillText(canvasCtx, { text: params.printTimeString, fontSize: '8px', fontWeight: 'normal', color: '#666', x: 5 + text.width, y: 27 + 5, textAlign: 'left' });

			// 编号
			fillText(canvasCtx, { text: params.orderNo, fontSize: '8px', fontWeight: 'normal', color: '#666', x: 375 - 5, y: 27 + 5, textAlign: 'right' });
			text = canvasCtx.measureText(params.orderNo);
			fillText(canvasCtx, { text: '编号：', fontSize: '8px', color: '#000', x: 375 - 5 - text.width, y: 27 + 5, textAlign: 'right' });

			// 每行起点 y坐标
			// 第一行
			let y = 45;
			const filedNameSize = '9px';//表名字号
			const filedValueSize = '9px';//值字号
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			if (params.saleType === 1) { // 1 同步拍, 2: '在线拍',3: '即时拍',4: '联合拍',5: '全网拍', 6: '专场拍'
				// 拍卖会
				fillText(canvasCtx, { text: '拍卖会', fontSize: filedNameSize, x: 61 / 2 + 5, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.auctionTitle, fontSize: '9px', color: '#666', x: 5 + 62 + 5, y: y + (cellHeight / 2), textAlign: 'left' });

				y += cellHeight;
				// 第二行
				fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
				// 拍品序号
				fillText(canvasCtx, { text: '拍品序号', fontSize: filedNameSize, x: 5 + 30.5, y: y + 30 / 2 });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 30 });
				fillText(canvasCtx, { text: params.auctionVehicleOrder, fontSize: '9px', color: '#666', x: 5 + 61 + 30.5, y: y + 30 / 2 });
				fillLine(canvasCtx, { sX: 5 + 61 + 61, sY: y, eX: 5 + 61 + 61, eY: y + 45 });
				// 品牌型号
				fillText(canvasCtx, { text: '品牌型号', fontSize: filedNameSize, x: 5 + 61 * 2 + 30.5, y: y + 30 / 2 });
				fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + 30 });
				const vechileNameX = 5 + 61 * 3 + 91;
				autoFillText(canvasCtx, { text: params.vechileNameAll, fontSize: '9px', color: '#666', width: 170, height: 30, x: vechileNameX, y, paddingTop: 5, lineHeight: (cellHeight / 2) });

				y += 30;
			} else {
				// 品牌型号
				fillText(canvasCtx, { text: '品牌型号', fontSize: filedNameSize, x: 61 / 2 + 5, y: y + 25 / 2 });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 28 });
				const vechileNameX = 5 + 61 + 5;
				autoFillText(canvasCtx, { text: params.vechileNameAll, fontSize: '9px', color: '#666', width: 295, height: 25, x: vechileNameX, y, textAlign: 'left' });
				
				y += 25;
				// 第二行
				fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
				fillText(canvasCtx, { text: '成交日期', fontSize: filedNameSize, x: 61 / 2 + 5, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.bidderTimeString, fontSize: '9px', x: 5 + 61 + 61 / 2, y: y + (cellHeight / 2) + 1, color: '#666' });
				fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + cellHeight });
				fillText(canvasCtx, { text: '竞拍城市', fontSize: filedNameSize, x: 5 + 61 * 2 + 61 / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.city, fontSize: '9px', x: 5 + 61 * 3 + 5, y: y + (cellHeight / 2), color: '#666', textAlign: 'left' });
				y += cellHeight;
			}

			// 第三行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			// 原车牌号
			fillText(canvasCtx, { text: '原车牌号', fontSize: filedNameSize, x: 5 + 61 / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.licenseCode, fontSize: '9px', x: 5 + 61 + 30.5, y: y + (cellHeight / 2), color: '#666' });
			fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + cellHeight });
			// 车架号
			fillText(canvasCtx, { text: '车架号', fontSize: filedNameSize, x: 5 + 61 * 2 + 61 / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.vinCode, fontSize: '9px', x: 5 + 61 * 3 + 5, y: y + (cellHeight / 2) + 1, textAlign: 'left', color: '#666' });

			y += cellHeight;
			// 第四行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			// 成交价
			fillText(canvasCtx, { text: '成交价', fontSize: filedNameSize, x: 5 + 61 / 2, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.finalPriceString ? (`¥ ${params.finalPriceString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 + 61 / 2, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + cellHeight });
			// 佣金类型
			fillText(canvasCtx, { text: '佣金类型', fontSize: filedNameSize, x: 5 + 61 * 2 + 61 / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.commissionType, fontSize: '9px', color: '#666', x: 5 + 61 * 3 + 61 / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: 5 + 61 * 4, sY: y, eX: 5 + 61 * 4, eY: y + cellHeight });
			// 佣金
			fillText(canvasCtx, { text: '佣金', fontSize: filedNameSize, x: 5 + 61 * 4 + 61 / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: 5 + 61 * 5, sY: y, eX: 5 + 61 * 5, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.buyerCommissionFeeString ? (`¥ ${params.buyerCommissionFeeString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 * 5 + 61 / 2, y: y + (cellHeight / 2) + 1 });

			// 第五行
			y += cellHeight;
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });

			// 成交总额
			fillText(canvasCtx, { text: '成交总额', fontSize: filedNameSize, x: 5 + 61 / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.totalPriceString ? (`¥ ${params.totalPriceString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 + 61 / 2, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + cellHeight });
			fillText(canvasCtx, { text: '办证费', fontSize: filedNameSize, x: 5 + 61 * 2 + 61 / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.licenseFeeString ? (`¥ ${params.licenseFeeString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 * 3 + 61 / 2, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: 5 + 61 * 4, sY: y, eX: 5 + 61 * 4, eY: y + cellHeight });
			fillText(canvasCtx, { text: '储运费', fontSize: filedNameSize, x: 5 + 61 * 4 + 61 / 2, y: y + (cellHeight / 2) });
			fillText(canvasCtx, { text: params.exWarehouseFeeString ? (`¥ ${params.exWarehouseFeeString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 * 5 + 61 / 2, y: y + (cellHeight / 2) + 1 });
			fillLine(canvasCtx, { sX: 5 + 61 * 5, sY: y, eX: 5 + 61 * 5, eY: y + cellHeight });

			y += cellHeight;
			// 第六行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			// 成交总额（大写）
			fillText(canvasCtx, { text: '成交总额', fontSize: filedNameSize, x: 5 + 61 / 2, y: y + (cellHeight / 2) });
			fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + cellHeight });
			fillText(canvasCtx, { text: params.totalPriceChinese ? `（大写）¥ ${params.totalPriceChinese}整` : '', fontSize: '9px', color: '#666', x: 5 + 61 + 5, y: y + (cellHeight / 2), textAlign: 'left' });

			y += cellHeight;
			// 第七行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			if (params.saleType === 1) {
				// 成交号牌
				fillText(canvasCtx, { text: '成交号牌', fontSize: filedNameSize, x: 5 + 61 / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.auctionNumber, fontSize: '9px', color: '#666', x: 5 + 61 + (61) / 2, y: y + (cellHeight / 2) + 1 });
				fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + cellHeight });
				fillText(canvasCtx, { text: '登记姓名', fontSize: filedNameSize, x: 5 + 61 * 2 + 61 / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + cellHeight });
				autoFillText(canvasCtx, { text: params.bidderName, fontSize: '9px', color: '#666', width: 60, height: cellHeight, x: 5 + 61 * 3 + (61) / 2, y });
				fillLine(canvasCtx, { sX: 5 + 61 * 4, sY: y, eX: 5 + 61 * 4, eY: y + cellHeight });
				// 开单人
				fillText(canvasCtx, { text: '开单人', fontSize: filedNameSize, x: 5 + 61 * 4 + 61 / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: 5 + 61 * 5, sY: y, eX: 5 + 61 * 5, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.operator, fontSize: '9px', color: '#666', x: 5 + 61 * 5 + 61 / 2, y: y + (cellHeight / 2) });
			} else {
				// 买受人
				fillText(canvasCtx, { text: '买受人', fontSize: filedNameSize, x: 5 + 61 / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + cellHeight });
				autoFillText(canvasCtx, { text: `${params.bidderName || '-'}（${params.idCardNum || '-'} ）`, fontSize: '9px', color: '#666', x: 5 + 61 + (61 * 3) / 2, y, height: cellHeight, width: 60 * 3 - 6 });
				fillLine(canvasCtx, { sX: 5 + 61 * 4, sY: y, eX: 5 + 61 * 4, eY: y + cellHeight });
				// 开单人
				fillText(canvasCtx, { text: '开单人', fontSize: filedNameSize, x: 5 + 61 * 4 + 61 / 2, y: y + (cellHeight / 2) });
				fillLine(canvasCtx, { sX: 5 + 61 * 5, sY: y, eX: 5 + 61 * 5, eY: y + cellHeight });
				fillText(canvasCtx, { text: params.operator, fontSize: '9px', color: '#666', x: 5 + 61 * 5 + 61 / 2, y: y + (cellHeight / 2) });
			}

			y += cellHeight;
			// 第八行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			const tipsFontSize = '6px';
			const tipsLineHeight = 10;
			console.log(getWidth(canvasCtx, '一人账户支付价款，将被原路全额退还，', '6px'));
			// 说明
			fillTextWarp(
				canvasCtx,
				{
					text: '本人竞买前已知悉竞买车辆的现状，且了解车辆详情仅供本人参考。本人签署本“成交确认单”即表明对竞买车辆的现状',
					x: 5 + 5 + 1,
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
					text: '（包括但不限于车',
					x: 5 + 5 + 1 + 310,
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
					text: '辆外观、内饰现状、车辆机械运行状态、车辆维修记录、保险记录等）及竞买程序无任何异议，并予以确认。本人提车后，不以车况不符向贵方及委托方主张任何权益。支付成交价款的银行账户信息应与买受人参拍账号信息一致，即姓名、身份证等为同一人，若非同一人账户支付价款，将被原路全额退还，',
					x: 5 + 5 + 1,
					y: y + 8 + tipsLineHeight * 1,
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
					text: '超过约定支付期限者视作违规，保证金作违约金不予退还。',
					x: 5 + 5 + 1 + 108,
					y: y + 8 + tipsLineHeight * 3,
					textAlign: 'left',
					width: 352,
					fontSize: tipsFontSize,
					fontWeight: 'normal',
				}
			);

			y = y + 8 + tipsLineHeight * 4 - 2;
			// 左外边框
			fillLine(canvasCtx, { sX: 5, sY: 45, eX: 5, eY: y });
			// 右外边框
			fillLine(canvasCtx, { sX: 370, sY: 45, eX: 370, eY: y });
			// 下外边框
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });

			// 买受人签字
			fillText(canvasCtx, { text: '买受人签字:', x: 5, y: y + 12, textAlign: 'left' });
			// 签名图
			if(params.signUrl) {
				const signImg = new Image();
				signImg.onload = () => canvasCtx.drawImage(signImg, 5 + 55, y + 2, 54, 28);
				signImg.onerror = err => { throw err; };
				signImg.src = params.signUrl;
			}
			// 日期
			fillText(canvasCtx, { text: '日期:', x: 122, y: y + 12, textAlign: 'left' });
			fillText(canvasCtx, { text: params.signDateString, x: 152, y: y + 12, textAlign: 'left', color: '#666' });
			fillText(canvasCtx, { text: '注意:本成交确认单涂改无效', x: 370, y: y + 12, textAlign: 'right' });
			console.log('height=>', y + 6 + 15);
			ctx.body = {
				code: 0,
				data: await promisify(canvas.toDataURL).call(canvas, 'image/jpg', 1)
			};
			ctx.logger.info('成功');
		} catch (e) {
			ctx.logger.warn('request=>', JSON.stringify(e));
			ctx.body = {
				code: 999,
				data: null,
				message: '系统错误'
			};
		}
	}
}

module.exports = HomeController;
