'use strict';

// 计算宽度
const getWidth = (ctx, text, fontSize) => {
	ctx.font = fontSize + 'Helvetica';
	return ctx.measureText(text).width;
};

// 画文字
const fillText = (ctx, opt) => {
	const { fontSize, color, text, x, y, width, height, textAlign, underline, fontWeight } = opt;
	ctx.textAlign = textAlign || 'center';
	ctx.fillStyle = color || '#000';
	ctx.font = `${fontWeight || 'bold'} ${fontSize || '10px'} Helvetica2`;// Avenir Helvetica
	ctx.textBaseline = 'middle';
	ctx.fillText(text || '-', x, y, width, height);
	if (underline) {
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = '#000';
		ctx.beginPath();
		ctx.lineTo(x, y + 5);
		ctx.lineTo(x + width, y + 5);
		ctx.stroke();
	}
};

module.exports = {
	fillText,
	// 画线
	fillLine(ctx, opt) {
		const { sX, sY, eX, eY, color } = opt;
		ctx.lineWidth = 1;
		ctx.strokeStyle = color || '#000';
		ctx.beginPath();
		ctx.lineTo(sX, sY);
		ctx.lineTo(eX, eY);
		ctx.stroke();
	},
	// 计算行数   这是为了计算行高而做的函数
	getLines(ctx, text, fontSize, width) {
		const texts = text.split('\n');
		let line = 0;
		for (const key in texts) {
			line += Math.ceil(getWidth(ctx, texts[key], fontSize) / width);
		}
		return line;
	},
	getWidth,
	// 绘制换行文字
	fillTextWarp(ctx, opt) {
		let { text, x, y, width, maxLines, fontSize, lineHeight, ...options } = opt;
		let textWidth = 0;
		let textIndex = 0; // 每次截取的开始的索引
		for (let i = 0; i < text.length; i++) {
			textWidth += getWidth(ctx, text[i], fontSize);
			if (textWidth >= width) {
				fillText(ctx, { text: text.substring(textIndex, i), x, y, fontSize, ...options, width: textWidth });
				y += lineHeight || 12;
				textWidth = 0;
				textIndex = i;
			}
			if (i === text.length - 1) {
				fillText(ctx, { text: text.substring(textIndex, i + 1), x, y, fontSize, ...options, width: getWidth(ctx, text.substring(textIndex, i + 1), fontSize) });
			}

		}
		// console.log(text, x, y, width, maxLines);
	},
};
