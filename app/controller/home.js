'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const { promisify } = require('util');
const { getWidth } = require('../extend/helper');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async draw() {
    const { ctx } = this;
    const { fillText, fillTextWarp, getLines, fillLine } = ctx.helper;
    const params = JSON.parse(ctx.query.params);

    // 图片放大倍数
    const multiple = params.multiple || 2;
    // 设备像素比
    let { ratio, saleType } = params;
    ratio = ratio * multiple;
    const { createCanvas, Image } = require('canvas');
    const canvasHeight = saleType === 1 ? 300 : 290;
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
    fillText(canvasCtx, { text: params.printTimeString, fontSize: '10px', fontWeight: 'normal', color: '#666', x: 5 + text.width, y: 27 + 6, textAlign: 'left' });

    // 编号
    fillText(canvasCtx, { text: params.orderNo, fontSize: '10px', fontWeight: 'normal', color: '#666', x: 375 - 5, y: 27 + 6, textAlign: 'right' });
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
      fillText(canvasCtx, { text: '品牌型号', fontSize: '10px', x: 5 + 61 * 2 + 30.5, y: y + 45 / 2 });
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
    fillText(canvasCtx, { text: '原车牌号', fontSize: '10px', x: 5 + 61 / 2 * 1, y: y + 10 });
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
        width: 355,
        fontSize: tipsFontSize,
        fontWeight: 'normal',
        lineHeight: tipsLineHeight
      }
    );

    fillTextWarp(
      canvasCtx,
      {
        text: '（包括但不限于车辆外观、内饰现状、车辆机械运行状态、车辆维修记录、保险记录等）及竞买程序无任何异议，',
        x: 5 + 5 + 1 + 7,
        y: y + 8 + tipsLineHeight,
        textAlign: 'left',
        width: 355,
        fontSize: tipsFontSize,
        underline: true,
        lineHeight: tipsLineHeight
      }
    );

    fillTextWarp(
      canvasCtx,
      {
        text: '并予以确认。本人提车后，不以车况不符向贵方及委托方主张任何权益。支付成交价款的银行账户信息应与买受人参拍账号信息一致，即姓名、身份证等为同一人，若非同一人账户支付价款，将被原路全额退还，',
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
        text: '超过约定支付期',
        x: 5 + 5 + 1 + 301,
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
        text: '限者视作违规，保证金作违约金不予退还。',
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
    fillText(canvasCtx, { text: '买受人签字：', x: 5, y: y + 12, textAlign: 'left' });
    // 签名图
    const signImg = new Image();
    signImg.onload = () => canvasCtx.drawImage(signImg, 5 + 60, y + 6, 54, 30);
    signImg.onerror = err => { throw err; };
    signImg.src = params.signUrl || 'data:image/png;base64,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';

    fillText(canvasCtx, { text: '日期：', x: 122, y: y + 12, textAlign: 'left' });
    fillText(canvasCtx, { text: params.signDateString, x: 152, y: y + 12 + 1, textAlign: 'left', color: '#666' });
    fillText(canvasCtx, { text: '注意：本成交确认单涂改无效', x: 370, y: y + 12, textAlign: 'right' });

    const data = await promisify(canvas.toDataURL).call(canvas, 'image/jpeg', 1);
    ctx.body = data;
    console.log('height=>', y + 6 + 30);
  }
}

module.exports = HomeController;
