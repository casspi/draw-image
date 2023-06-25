'use strict';
const Service = require('egg').Service;

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
			[{ field: '付款日期', value: paymentDate }, { field: '付款金额', value: `${payFee}   ${payFeeChinese}` }],
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
    
		// 绘制印章边框     
		canvasCtx.lineWidth = 7;  
		canvasCtx.strokeStyle = '#f54848';  
		canvasCtx.beginPath();  
		canvasCtx.arc(6 * cellWidth, 200 + 6 * cellHeight, 120, 0, Math.PI * 2);  
		canvasCtx.stroke();  
  
		// 画五角星  
		create5star(canvasCtx, 6 * cellWidth, 200 + 6 * cellHeight, 20, '#f00', 0);  

		// 绘制印章单位    
		const sealText = '上海常信拍卖有限公司'; 
		canvasCtx.lineWidth = 2;
		canvasCtx.translate(6 * cellWidth, 200 + 6 * cellHeight,);// 平移到此位置,  
		canvasCtx.font = '25px';  
		const count = sealText.length;// 字数     
		const angle = 4 * Math.PI / (3 * (count - 1));// 字间角度     
		const chars = sealText.split('');     
		let c;  
		for (let i = 0; i < count; i++) {    
			c = chars[i];// 需要绘制的字符     
			if (i === 0) canvasCtx.rotate(5 * Math.PI / 6);  
			else { canvasCtx.rotate(angle); }//   
			canvasCtx.save();   
			canvasCtx.translate(90, 0);// 平移到此位置,此时字和x轴垂直     
			canvasCtx.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴     
			canvasCtx.strokeText(c, 0, 0);// 此点为字的中心点     
			canvasCtx.restore();               
		}     
  
		// 绘制五角星    
		/**  
     * 创建一个五角星形状. 该五角星的中心坐标为(sx,sy),中心到顶点的距离为radius,rotate=0时一个顶点在对称轴上  
     * rotate:绕对称轴旋转rotate弧度  
     */    
		function create5star(canvasCtx, sx, sy, radius, color, rotato) {    
			canvasCtx.save();    
			canvasCtx.fillStyle = color;    
			canvasCtx.translate(sx, sy);// 移动坐标原点    
			canvasCtx.rotate(Math.PI + rotato);// 旋转    
			canvasCtx.beginPath();// 创建路径    
			let x = Math.sin(0);    
			let y = Math.cos(0);    
			const dig = Math.PI / 5 * 4;    
			for (let i = 0; i < 5; i++) { // 画五角星的五条边    
				 x = Math.sin(i * dig);    
				 y = Math.cos(i * dig);    
				canvasCtx.lineTo(x * radius, y * radius);    
			}     
			canvasCtx.closePath();    
			canvasCtx.stroke();    
			canvasCtx.fill();    
			canvasCtx.restore();    
		}
	}

	// 生成pdf并用base64编码
	generatePdfToBase64(canvas) {
		const pdfBuffer = canvas.toBuffer();
		return `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString('base64')}`;
	}
}

module.exports = TradeCertificateService;
