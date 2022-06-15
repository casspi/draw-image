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
			const { fillText, fillTextWarp, getLines, fillLine, getWidth } = ctx.helper;
			console.log(ctx.request.body);
			const params = ctx.request.body;

			// 图片放大倍数
			const multiple = params.multiple || 2;
			// 设备像素比
			let { ratio, saleType } = params;
			ratio = ratio * multiple;
			const canvasHeight = saleType === 1 ? 295 : 285;
			const canvas = createCanvas(375 * ratio, canvasHeight * ratio);
			const canvasCtx = canvas.getContext('2d');
			// 画布白色背景
			canvasCtx.scale(ratio, ratio);
			canvasCtx.fillStyle = '#fff';
			canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

			// logo
			const logo = path.join(__dirname, '../public/assets/image/', 'autostreets_logo.png');
			const img = new Image();
			img.onload = () => canvasCtx.drawImage(img, 5, 5, 76, 17);
			img.onerror = err => { throw err; };
			img.src = logo;

			// 标题
			fillText(canvasCtx, { text: params.title, x: 375 / 2, y: 10 });

			// 打印时间
			fillText(canvasCtx, { text: '打印时间：', fontSize: '10px', x: 5, y: 27 + 5, textAlign: 'left' });
			let text = canvasCtx.measureText('打印时间：');
			fillText(canvasCtx, { text: params.printTimeString, fontSize: '10px', fontWeight: 'normal', color: '#666', x: 5 + text.width, y: 27 + 5, textAlign: 'left' });

			// 编号
			fillText(canvasCtx, { text: params.orderNo, fontSize: '10px', fontWeight: 'normal', color: '#666', x: 375 - 5, y: 27 + 5, textAlign: 'right' });
			text = canvasCtx.measureText(params.orderNo);
			fillText(canvasCtx, { text: '编号：', fontSize: '10px', color: '#000', x: 375 - 5 - text.width, y: 27 + 5, textAlign: 'right' });

			// 每行起点 y坐标
			// 第一行
			let y = 45;
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			if (params.saleType === 1) { // 1 同步拍, 2: '在线拍',3: '即时拍',4: '联合拍',5: '全网拍', 6: '专场拍'
				// 拍卖会
				fillText(canvasCtx, { text: '拍卖会', fontSize: '10px', x: 61 / 2 + 5, y: y + 10 });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 20 });
				fillText(canvasCtx, { text: params.auctionTitle, fontSize: '9px', color: '#666', x: 5 + 62 + 5, y: y + 10, textAlign: 'left' });

				y += 20;
				// 第二行
				fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
				// 拍品序号
				fillText(canvasCtx, { text: '拍品序号', x: 5 + 30.5, y: y + 45 / 2 });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 45 });
				fillText(canvasCtx, { text: params.auctionVehicleOrder, fontSize: '9px', color: '#666', x: 5 + 61 + 30.5, y: y + 45 / 2 });
				fillLine(canvasCtx, { sX: 5 + 61 + 61, sY: y, eX: 5 + 61 + 61, eY: y + 45 });
				// 品牌型号
				fillText(canvasCtx, { text: '品牌型号', fontSize: '10px', x: 5 + 61 * 2 + 30.5, y: y + 45 / 2 - 4 });
				fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + 45 });
				const vechileNameAllLines = getLines(canvasCtx, params.vechileNameAll, '9px', 178);
				const vechileNameX = 5 + 61 * 3 + 91;
				const vechileNameY = y + [ 22, 17, 12 ][vechileNameAllLines - 1];
				fillTextWarp(canvasCtx, { x: vechileNameX, y: vechileNameY, text: params.vechileNameAll, width: 178, maxLines: vechileNameAllLines, color: '#666', fontSize: '9px' });
				y += 45;
			} else {
				// 品牌型号
				fillText(canvasCtx, { text: '品牌型号', fontSize: '10px', x: 61 / 2 + 5, y: y + 28 / 2 });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 28 });
				const vechileNameAllLines = getLines(canvasCtx, params.vechileNameAll, '9px', 295);
				const vechileNameX = 5 + 61 + 5;
				const vechileNameY = y + [ 14, 7 ][vechileNameAllLines - 1];
				fillTextWarp(canvasCtx, { x: vechileNameX, y: vechileNameY, text: params.vechileNameAll, width: 295, maxLines: vechileNameAllLines, color: '#666', fontSize: '9px', textAlign: 'left' });

				y += 25;
				// 第二行
				fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
				fillText(canvasCtx, { text: '成交日期', fontSize: '10px', x: 61 / 2 + 5, y: y + 10 });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 20 });
				fillText(canvasCtx, { text: params.bidderTimeString, fontSize: '9px', x: 5 + 61 + 61 / 2, y: y + 10 + 1, color: '#666' });
				fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + 20 });
				fillText(canvasCtx, { text: '竞拍城市', fontSize: '10px', x: 5 + 61 * 2 + 61 / 2, y: y + 10 });
				fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + 20 });
				fillText(canvasCtx, { text: params.city, fontSize: '9px', x: 5 + 61 * 3 + 5, y: y + 10, color: '#666', textAlign: 'left' });
				y += 20;
			}

			// 第三行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			// 原车牌号
			fillText(canvasCtx, { text: '原车牌号', fontSize: '10px', x: 5 + 61 / 2, y: y + 10 });
			fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 20 });
			fillText(canvasCtx, { text: params.licenseCode, fontSize: '9px', x: 5 + 61 + 30.5, y: y + 10, color: '#666' });
			fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + 20 });
			// 车架号
			fillText(canvasCtx, { text: '车架号', fontSize: '10px', x: 5 + 61 * 2 + 61 / 2, y: y + 10 });
			fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + 20 });
			fillText(canvasCtx, { text: params.vinCode, fontSize: '9px', x: 5 + 61 * 3 + 5, y: y + 10 + 1, textAlign: 'left', color: '#666' });

			y += 20;
			// 第四行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			// 成交价
			fillText(canvasCtx, { text: '成交价', fontSize: '10px', x: 5 + 61 / 2, y: y + 10 + 1 });
			fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 20 });
			fillText(canvasCtx, { text: params.finalPriceString ? (`¥ ${params.finalPriceString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 + 61 / 2, y: y + 10 + 1 });
			fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + 20 });
			// 佣金类型
			fillText(canvasCtx, { text: '佣金类型', fontSize: '10px', x: 5 + 61 * 2 + 61 / 2, y: y + 10 });
			fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + 20 });
			fillText(canvasCtx, { text: params.commissionType, fontSize: '9px', color: '#666', x: 5 + 61 * 3 + 61 / 2, y: y + 10 });
			fillLine(canvasCtx, { sX: 5 + 61 * 4, sY: y, eX: 5 + 61 * 4, eY: y + 20 });
			// 佣金
			fillText(canvasCtx, { text: '佣金', fontSize: '10px', x: 5 + 61 * 4 + 61 / 2, y: y + 10 });
			fillLine(canvasCtx, { sX: 5 + 61 * 5, sY: y, eX: 5 + 61 * 5, eY: y + 20 });
			fillText(canvasCtx, { text: params.buyerCommissionFeeString ? (`¥ ${params.buyerCommissionFeeString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 * 5 + 61 / 2, y: y + 10 + 1 });

			// 第五行
			y += 20;
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });

			// 成交总额
			fillText(canvasCtx, { text: '成交总额', fontSize: '10px', x: 5 + 61 / 2, y: y + 10 });
			fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 20 });
			fillText(canvasCtx, { text: params.totalPriceString ? (`¥ ${params.totalPriceString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 + 61 / 2, y: y + 10 + 1 });
			fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + 20 });
			fillText(canvasCtx, { text: '办证费', fontSize: '10px', x: 5 + 61 * 2 + 61 / 2, y: y + 10 });
			fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + 20 });
			fillText(canvasCtx, { text: params.licenseFeeString ? (`¥ ${params.licenseFeeString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 * 3 + 61 / 2, y: y + 10 + 1 });
			fillLine(canvasCtx, { sX: 5 + 61 * 4, sY: y, eX: 5 + 61 * 4, eY: y + 20 });
			fillText(canvasCtx, { text: '储运费', fontSize: '10px', x: 5 + 61 * 4 + 61 / 2, y: y + 10 });
			fillText(canvasCtx, { text: params.exWarehouseFeeString ? (`¥ ${params.exWarehouseFeeString}`) : '', fontSize: '9px', color: '#666', x: 5 + 61 * 5 + 61 / 2, y: y + 10 + 1 });
			fillLine(canvasCtx, { sX: 5 + 61 * 5, sY: y, eX: 5 + 61 * 5, eY: y + 20 });

			y += 20;
			// 第六行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			// 成交总额（大写）
			fillText(canvasCtx, { text: '成交总额', fontSize: '10px', x: 5 + 61 / 2, y: y + 10 });
			fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 20 });
			fillText(canvasCtx, { text: params.totalPriceChinese ? `（大写）¥ ${params.totalPriceChinese}整` : '', fontSize: '9px', color: '#666', x: 5 + 61 + 5, y: y + 10, textAlign: 'left' });

			y += 20;
			// 第七行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			if (params.saleType === 1) {
				// 成交号牌
				fillText(canvasCtx, { text: '成交号牌', fontSize: '10px', x: 5 + 61 / 2, y: y + 10 });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 20 });
				fillText(canvasCtx, { text: params.auctionNumber, fontSize: '9px', color: '#666', x: 5 + 61 + (61) / 2, y: y + 10 + 1 });
				fillLine(canvasCtx, { sX: 5 + 61 * 2, sY: y, eX: 5 + 61 * 2, eY: y + 20 });
				fillText(canvasCtx, { text: '登记姓名', fontSize: '10px', x: 5 + 61 * 2 + 61 / 2, y: y + 10 });
				fillLine(canvasCtx, { sX: 5 + 61 * 3, sY: y, eX: 5 + 61 * 3, eY: y + 20 });
				fillText(canvasCtx, { text: params.bidderName, fontSize: '9px', color: '#666', x: 5 + 61 * 3 + (61) / 2, y: y + 10 + 1 });
				fillLine(canvasCtx, { sX: 5 + 61 * 4, sY: y, eX: 5 + 61 * 4, eY: y + 20 });
				// 开单人
				fillText(canvasCtx, { text: '开单人', fontSize: '10px', x: 5 + 61 * 4 + 61 / 2, y: y + 10 });
				fillLine(canvasCtx, { sX: 5 + 61 * 5, sY: y, eX: 5 + 61 * 5, eY: y + 20 });
				fillText(canvasCtx, { text: params.operator, fontSize: '9px', color: '#666', x: 5 + 61 * 5 + 61 / 2, y: y + 10 });
			} else {
				// 买受人
				fillText(canvasCtx, { text: '买受人', fontSize: '10px', x: 5 + 61 / 2, y: y + 10 });
				fillLine(canvasCtx, { sX: 5 + 61, sY: y, eX: 5 + 61, eY: y + 20 });
				fillText(canvasCtx, { text: `${params.bidderName || '-'}（${params.idCardNum || '-'} ）`, fontSize: '9px', color: '#666', x: 5 + 61 + (61 * 3) / 2, y: y + 10 });
				fillLine(canvasCtx, { sX: 5 + 61 * 4, sY: y, eX: 5 + 61 * 4, eY: y + 20 });
				// 开单人
				fillText(canvasCtx, { text: '开单人', fontSize: '10px', x: 5 + 61 * 4 + 61 / 2, y: y + 10 });
				fillLine(canvasCtx, { sX: 5 + 61 * 5, sY: y, eX: 5 + 61 * 5, eY: y + 20 });
				fillText(canvasCtx, { text: params.operator, fontSize: '9px', color: '#666', x: 5 + 61 * 5 + 61 / 2, y: y + 10 });
			}

			y += 20;
			// 第八行
			fillLine(canvasCtx, { sX: 5, sY: y, eX: 370, eY: y });
			const tipsFontSize = '7px';
			const tipsLineHeight = 10;
			console.log(getWidth(canvasCtx, '状', '7px'));
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
					text: '（包括但不限于车辆外观、内饰现状、车辆机械运行状态、车辆维修记录、保险记录等）及竞买程序无任何异',
					x: 5 + 5 + 1 + (7 * 2),
					y: y + 8 + tipsLineHeight,
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
					text: '议，并予以确认。本人提车后，不以车况不符向贵方及委托方主张任何权益。支付成交价款的银行账户信息应与买受人参拍账号信息一致，即姓名、身份证等为同一人，若非同一人账户支付价款，将被原路全额退还，',
					x: 5 + 5 + 1,
					y: y + 8 + tipsLineHeight * 2,
					textAlign: 'left',
					width: 352,
					fontSize: tipsFontSize,
					underline: true,
					lineHeight: tipsLineHeight
				}
			);

			console.log(getWidth(canvasCtx, '参拍账号信息一致，即姓名、身份证等为同一人，若非同一人账户支付价款，将被原路全额退还，', '7px'));

			fillTextWarp(
				canvasCtx,
				{
					text: '超过约定支',
					x: 5 + 5 + 1 + 315,
					y: y + 8 + tipsLineHeight * 3,
					textAlign: 'left',
					width: 352,
					fontSize: tipsFontSize,
					fontWeight: 'normal',
				}
			);

			fillTextWarp(
				canvasCtx,
				{
					text: '付期限者视作违规，保证金作违约金不予退还。',
					x: 5 + 5 + 1,
					y: y + 8 + tipsLineHeight * 4,
					textAlign: 'left',
					width: 352,
					fontSize: tipsFontSize,
					fontWeight: 'normal',
				}
			);

			y = y + 8 + tipsLineHeight * 5 - 4;
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
				signImg.onload = () => canvasCtx.drawImage(signImg, 5 + 55, y + 2, 54, 30);
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
