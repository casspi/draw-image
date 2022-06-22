'use strict';
const { Image } = require('canvas');

// 计算宽度
const getWidth = (ctx, text, fontSize, fontWeight) => {
	ctx.font = `${fontSize} + ${fontWeight === 'normal' ? 'MSYH' : 'MSYHBD'}`;
	return ctx.measureText(text).width;
};
// 画线
const fillLine = (ctx, opt) => {
	const { sX, sY, eX, eY, color } = opt;
	ctx.lineWidth = 1;
	ctx.strokeStyle = color || '#000';
	ctx.beginPath();
	ctx.lineTo(sX, sY);
	ctx.lineTo(eX, eY);
	ctx.stroke();
};
// 画文字
const fillText = (ctx, opt) => {
	const { fontSize, color, text, x, y, width, height, textAlign, underline, fontWeight } = opt;
	ctx.textAlign = textAlign || 'center';
	ctx.fillStyle = color || '#000';
	ctx.font = `${fontSize || '10px'} ${fontWeight === 'normal' ? 'MSYH' : 'MSYHBD'}`;// Avenir Helvetica
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

// 绘制换行文字
const fillTextWarp = (ctx, opt) => {
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
};

// 计算行数   这是为了计算行高而做的函数
const getLines = (ctx, text, fontSize, width) => {
	const texts = text.split('\n');
	let line = 0;
	for (const key in texts) {
		line += Math.ceil(getWidth(ctx, texts[key], fontSize) / width);
	}
	return line;
};

// 画文字 自动降字号 默认最多2行
const autoFillText = (ctx, options) => {
	let { width, height, fontSize, text, maxLines = 2, y, lineHeight, paddingTop = 0 } = options;
	const lines = getLines(ctx, text, fontSize, width);
	if (lines > maxLines) {
		fontSize = (parseFloat(fontSize) - 1) + 'px';
		autoFillText(ctx, { ...options, fontSize });
	} else {
		// 第一行 y轴坐标
		height -= paddingTop * 2;
		y = y + paddingTop + (height / lines) / 2;
		lineHeight = lineHeight || (height / lines);
		fillTextWarp(ctx, { ...options, y, lineHeight });
	}
};

const drawImage = (ctx, options) => {
	const { x, y, width, height, src } = options;
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			ctx.drawImage(img, x, y, width, height);
			resolve();
		};
		img.onerror = err => {
			reject(err);
		};
		img.src = src;
	});
};

module.exports = {
	fillText,
	fillLine,
	getLines,
	getWidth,
	fillTextWarp,
	autoFillText,
	drawImage
};
