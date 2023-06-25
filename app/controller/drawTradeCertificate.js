'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const { createCanvas, registerFont } = require('canvas');
registerFont(path.join(__dirname, '../public/assets/fonts/MSYH.TTF'), { family: 'MSYH' });
registerFont(path.join(__dirname, '../public/assets/fonts/MSYHBD.TTF'), { family: 'MSYHBD' });
class DrawTradeCertificateController extends Controller {
	/**
	 * @apiVersion 1.0.0
	 * @api {post} /drawTradeCertificate  绘制交易凭证
	 * @apiGroup app交易凭证
	 *
	 * @apiBody  {String} collaborate 合作主体
	 * 
	 * @apiBody  {String} createDate 创建日期
	 * @apiBody  {String} paymentDate 付款日期
	 * @apiBody  {String} payFee 付款金额
	 * @apiBody  {String} payFeeChinese 付款金额中文
	 * @apiBody  {String} vinCode 车架号
	 * @apiBody  {String} licenseCode 车牌号
	 * @apiBody  {String} holder 收款方
	 * @apiBody  {String} holderAccountNumber 收款方账号
	 * @apiBody  {String} payCompany 付款方
	 * @apiBody  {String} payAccountNumber 付款方账号
	 * @apiBody  {String} holderBranchBank 收款方开户行
	 * @apiBody  {String} payBranchBank 付款方开户行
	 *
	 * @apiSuccess (成功) {Object} data
	 * @apiSampleRequest /tradeCertificate
	 */
	async tradeCertificate() {
		const { ctx } = this;

		ctx.logger.info('request=>tradeCertificate', ctx.request.body);
		// 图片放大倍数
		const multiple = 1;

		const canvasWidth = 1476 * multiple;// 图片宽度
		const canvasPadding = 68 * multiple;// 内边距
		const canvasHeight = 974 * multiple;// 高度
		const canvas = createCanvas(canvasWidth, canvasHeight, 'pdf');
		const canvasCtx = canvas.getContext('2d');

		const cellHeight = 100 * multiple;// 单元格高度
		const cellWidth = (canvasWidth - 2 * canvasPadding) / 6 * multiple; // 单元格宽度
		const fontSize = 18 * multiple;
		const cellPadding = 16 * multiple; // 单元格内边距

		// 画布白色背景
		canvasCtx.fillStyle = '#fff';
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
		const configSize = { canvasWidth, canvasPadding, canvasHeight, cellWidth, cellHeight, fontSize, cellPadding, };

		try {
			ctx.service.tradeCertificate.drawTitle(canvasCtx, configSize);
			ctx.service.tradeCertificate.drawBorder(canvasCtx, configSize);
			ctx.service.tradeCertificate.drawText(canvasCtx, configSize);
			ctx.service.tradeCertificate.drawSeal(canvasCtx, configSize);
			ctx.body = {
				code: 0,
				data: ctx.service.tradeCertificate.generatePdfToBase64(canvas)
			};
		} catch (e) {
			ctx.logger.warn('request-err=>', e);
			ctx.body = {
				code: 999,
				data: null,
				message: '系统错误'
			};
		}
	}
}
module.exports = DrawTradeCertificateController;
