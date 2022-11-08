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
		ctx.logger.info('request=>draw', ctx.request.body);
		const params = ctx.request.body;
		try {
			const { fillText, autoFillText, fillTextWarp, fillLine, getWidth, drawImage } = ctx.helper;

			// 图片放大倍数
			const multiple = 1;
			// // 设备像素比
			// let { ratio } = params;
			// ratio = ratio * multiple;

			const canvasWidth = 1240 * multiple, // 图片宽度
				canvasHeight = (1754 + (2 - 2) * 176) * multiple, // 图片高度
				canvasPadding = 50 * multiple, // 左右边距
				cellHeight = 48 * multiple, // 单元格高度
				cellWidth = 47.5 * multiple, // 单元格宽度
				fontSize = 18 * multiple,
				indent = 16 * multiple;

			const innerWidth = canvasWidth - canvasPadding * 2;// 内容区宽度
			const configSize = { canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight, fontSize, indent, innerWidth };
			const canvas = createCanvas(canvasWidth, canvasHeight);
			const canvasCtx = canvas.getContext('2d');

			// 画布白色背景
			canvasCtx.scale(multiple, multiple);
			canvasCtx.fillStyle = '#fff';
			canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

			let y = 15; // 开始y轴坐标
			// 头部
			y = await ctx.service.draw.header(canvasCtx, params, { x: canvasPadding, y, ...configSize });
			y = y + 56;

			// 每行起点 y坐标
			// 第一行
			fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: canvasWidth - canvasPadding, eY: y, color: '#666' });

			// 多辆车辆订单信息
			// y = ctx.service.draw.baseInfo(canvasCtx, params, { x: canvasPadding, y, ...configSize });
			// 单车车辆信息
			y = ctx.service.draw.singleCarInfo(canvasCtx, params, { x: canvasPadding, y, ...configSize });
			// 增值服务信息
			y = await ctx.service.draw.valueAddedService(canvasCtx, params, { x: canvasPadding, y, ...configSize });
			// 交易总额
			y = ctx.service.draw.totalPrice(canvasCtx, params, { x: canvasPadding, y, ...configSize });
			// 盖章/签字
			y = await ctx.service.draw.otherAuctionSign(canvasCtx, params, { x: canvasPadding, y, ...configSize });

			// if (params.saleType === 1) { // 同步拍
			// 	y = await ctx.service.draw.syncAuctionSign(canvasCtx, params, { x: canvasPadding, y, ...configSize });
			// } else {
			// 	y = await ctx.service.draw.otherAuctionSign(canvasCtx, params, { x: canvasPadding, y, ...configSize });
			// }

			// 车辆列表
			// y = ctx.service.draw.carList(canvasCtx, params, { x: canvasPadding, y, ...configSize });

			// 左外边框
			fillLine(canvasCtx, { sX: canvasPadding, sY: 165, eX: canvasPadding, eY: y });
			// 右外边框
			fillLine(canvasCtx, { sX: canvasPadding + innerWidth, sY: 165, eX: canvasPadding + innerWidth, eY: y });
			// 下外边框
			// fillLine(canvasCtx, { sX: canvasPadding, sY: y, eX: innerWidth, eY: y });

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
