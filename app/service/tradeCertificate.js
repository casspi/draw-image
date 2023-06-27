'use strict';
const Service = require('egg').Service;
const path = require('path');
class TradeCertificateService extends Service {

	// 绘制标题
	drawTitle(canvasCtx, config) {
		const { ctx } = this;
		const { fillText } = ctx.helper;
		const { canvasWidth } = config;
		fillText(canvasCtx, { text: '交易凭证', x: canvasWidth / 2, y: 100, fontWeight: 700, fontSize: '50px', color: '#000' });
	}
  
	// 绘制边框
	drawBorder(canvasCtx, config) {
		const { ctx } = this;
		const { fillLine } = ctx.helper;
		const { canvasPadding, cellHeight, cellWidth } = config;
		// 绘制所有横线
		for (let i = 0; i < 7; i++) {
			fillLine(canvasCtx, { sX: canvasPadding, sY: 200 + i * cellHeight, eX: canvasPadding + 6 * cellWidth, eY: 200 + i * cellHeight });
		}

		// 绘制所有竖线
		fillLine(canvasCtx, { sX: canvasPadding, sY: 200, eX: canvasPadding, eY: 200 + 6 * cellHeight });
		fillLine(canvasCtx, { sX: canvasPadding + cellWidth, sY: 200, eX: canvasPadding + cellWidth, eY: 200 + 6 * cellHeight });
		fillLine(canvasCtx, { sX: canvasPadding + 3 * cellWidth, sY: 200, eX: canvasPadding + 3 * cellWidth, eY: 200 + 6 * cellHeight });
		fillLine(canvasCtx, { sX: canvasPadding + 4 * cellWidth, sY: 200, eX: canvasPadding + 4 * cellWidth, eY: 200 + 6 * cellHeight });
		fillLine(canvasCtx, { sX: canvasPadding + 6 * cellWidth, sY: 200, eX: canvasPadding + 6 * cellWidth, eY: 200 + 6 * cellHeight });
		
	} 

	// 绘制文字
	drawText(canvasCtx, config) {
		const { ctx } = this;
		const { fillText, autoFillText } = ctx.helper;
		const { cellWidth, cellPadding, cellHeight, canvasPadding } = config;
		const { collaborate, createDate, paymentDate, payFee, payFeeChinese, vinCode, licenseCode, holder, holderAccountNumber, payCompany, payAccountNumber, holderBranchBank, payBranchBank } = ctx.request.body;
		// 绘制时间
		fillText(canvasCtx, { text: createDate, x: canvasPadding + 6 * cellWidth, y: 160, textAlign: 'right', fontSize: '22px' });

		const structArr = [
			[{ field: '合作主体', value: collaborate }, {}], 
			[{ field: '付款日期', value: paymentDate }, { field: '付款金额', value: `${payFee || ''}   ${payFeeChinese || ''}` }],
			[{ field: '车架号', value: vinCode }, { field: '车牌号', value: licenseCode }],
			[{ field: '收款方', value: holder }, { field: '付款方', value: payCompany }],
			[{ field: '收款方账号', value: holderAccountNumber }, { field: '付款方账号', value: payAccountNumber }],
			[{ field: '收款方开户行', value: holderBranchBank }, { field: '付款方开户行', value: payBranchBank }]
		];
		for (let i = 0; i < structArr.length; i++) {
			// 绘制标题
			fillText(canvasCtx, { x: canvasPadding + cellWidth / 2, y: 200 + (i + 1 / 2) * cellHeight, text: structArr[i][0].field, fontSize: '25px', color: '#000' });
			fillText(canvasCtx, { x: canvasPadding + 3.5 * cellWidth, y: 200 + (i + 1 / 2) * cellHeight, text: structArr[i][1].field, fontSize: '25px', color: '#000' });

			// 绘制值
			autoFillText(canvasCtx, { x: canvasPadding + cellWidth + cellPadding, width: 2 * (cellWidth - cellPadding), y: 150 + (i + 1 / 2) * cellHeight, text: structArr[i][0].value || '', textAlign: 'left', height: cellHeight, lineHeight: cellHeight / 2, fontSize: '20px', color: '#333' });
			autoFillText(canvasCtx, { x: canvasPadding + 4 * cellWidth + cellPadding, width: 2 * (cellWidth - cellPadding), y: 150 + (i + 1 / 2) * cellHeight, text: structArr[i][1].value || '', textAlign: 'left', height: cellHeight, lineHeight: cellHeight / 2, fontSize: '20px', color: '#333' });


		}
	}

	// 绘制印章
	drawSeal(canvasCtx, config) {
		const { cellWidth, cellHeight, } = config;
		const { ctx } = this;
		const { drawImage } = ctx.helper;
		const logo = path.join(__dirname, '../public/assets/image/', 'seal.png');
		drawImage(canvasCtx, { x: 5.5 * cellWidth, y: 200 + 5.5 * cellHeight, width: 200, height: 200, src: logo });
	}

	// 生成pdf并用base64编码
	generatePdfToBase64(canvas) {
		const pdfBuffer = canvas.toBuffer();
		return `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString('base64')}`;
	}
}

module.exports = TradeCertificateService;
