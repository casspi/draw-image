'use strict';
const { Image } = require('canvas');

// 计算宽度
const getWidth = (ctx, text, fontSize, fontWeight) => {
	ctx.font = `${fontSize || '18px'} + ${fontWeight !== 'blod' ? 'MSYH' : 'MSYHBD'}`;
	return ctx.measureText(text).width;
};
// 画线
const fillLine = (ctx, opt) => {
	const { sX, sY, eX, eY, color } = opt;
	ctx.lineWidth = 1;
	ctx.strokeStyle = color || '#666';
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
	ctx.font = `${fontSize || '18px'} ${fontWeight !== 'bold' ? 'MSYH' : 'MSYHBD'}`;// Avenir Helvetica
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
	let { text = '-', x, y, width, maxLines, fontSize, lineHeight, ...options } = opt;
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
	let { width, height, fontSize, text = '-', maxLines = 2, y, lineHeight, paddingTop = 0 } = options;
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

const drawMosaic = (ctx, options) => {
	let { x, y, width, height = 40 } = options;
	y += 4;
	width += 20;
	const oImg = ctx.getImageData(x, y, width, height);
	console.log('oImg', oImg);
	const w = oImg.width;
	const h = oImg.height;
	// 马赛克的程度，数字越大越模糊
	const num = 6;
	// 等分画布
	const stepW = w / num;
	const stepH = h / num;
	function getXY(obj, x, y) {
		const w = obj.width;
		const color = [];
		color[0] = obj.data[4 * (y * w + x)] || 0;
		color[1] = obj.data[4 * (y * w + x) + 1] || 0;
		color[2] = obj.data[4 * (y * w + x) + 2] || 0;
		color[3] = obj.data[4 * (y * w + x) + 3] || 0;
		return color;
	}

	function setXY(obj, x, y, color) {
		const w = obj.width;
		obj.data[4 * (y * w + x)] = color[0];
		obj.data[4 * (y * w + x) + 1] = color[1];
		obj.data[4 * (y * w + x) + 2] = color[2];
		obj.data[4 * (y * w + x) + 3] = color[3];
	}
	// 这里是循环画布的像素点
	for (let i = 0; i < stepH; i++) {
		for (let j = 0; j < stepW; j++) {
			// 获取一个小方格的随机颜色，这是小方格的随机位置获取的
			const color = getXY(oImg, j * num + Math.floor(Math.random() * num), i * num + Math.floor(Math.random() * num));
			// console.log(color)
			// 这里是循环小方格的像素点，
			for (let k = 0; k < num; k++) {
				for (let l = 0; l < num; l++) {
					// 设置小方格的颜色
					setXY(oImg, j * num + l, i * num + k, color);
				}
			}

		}
	}
	ctx.putImageData(oImg, x, y);
};

module.exports = {
	fillText,
	fillLine,
	getLines,
	getWidth,
	fillTextWarp,
	autoFillText,
	drawImage,
	drawMosaic
};
