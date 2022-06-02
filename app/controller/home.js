'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');//在网上查到的readFile同步方式
const readFile = promisify(fs.readFile);
const { getWidth, fillText, getLines } =  require('../public/js/helper')

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async draw() {
    const params = JSON.parse(this.ctx.query.params)
    
    console.log(params.ratio)
    let { ratio } = params
    ratio = ratio*2
    const { createCanvas, loadImage, Image } = require('canvas')
    const canvas = createCanvas(375*ratio, 380*ratio)
    const ctx = canvas.getContext('2d')
   
    ctx.scale(ratio, ratio);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //logo
    const logo = path.join(__dirname, '../public/assets/image/', 'autostreets_logo.png')
    console.log(logo)
    const img = new Image()
    // 0, 0, 1795, 395,
    img.onload = () => ctx.drawImage(img, 5, 5, 76, 17)
    img.onerror = err => { throw err }
    img.src = logo
    // fs.readFile(logo, (err, squid) => {
    //   console.log(squid)
    //   if (err) throw err
    //   const img = new Image()
    //   // 0, 0, 1795, 395,
    //   img.onload = () => ctx.drawImage(img, 5*ratio, 5*ratio, 76*ratio, 17*ratio)
    //   img.onerror = err => { throw err }
    //   img.src = logo
    // })
    
    
    // 标题
    ctx.font = 'normal bolder 20px'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#000'
    ctx.fillText(params.title, 375/2, 10)
    
    //打印时间
    ctx.textAlign = 'left'
    fillText.call(ctx, {text:'打印时间：', font: '20px',  x: 5, y: 27+5})
    let text = ctx.measureText('打印时间：')
    fillText.call(ctx, {text: params.printTimeString, font: '20px', color:'#666', x: 5 + text.width, y:27+6})

    //编号
    ctx.textAlign = 'right'
    fillText.call(ctx, {text: params.orderNo, font: '20px', color:'#666', x: 375 - 5 , y:27+6})
    text = ctx.measureText(params.orderNo)
    fillText.call(ctx, {text:'编号：', font: '20px', color:'#000', x: 375-5-text.width, y: 27+5})

    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(5, 40)
    ctx.lineTo(370, 40)
    ctx.stroke()

    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(5, 40)
    ctx.lineTo(5, 332)
    ctx.stroke()

    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(370, 40)
    ctx.lineTo(370, 332)
    ctx.stroke()

    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(5, 332)
    ctx.lineTo(370, 332)
    ctx.stroke()

    //拍卖会
    ctx.textAlign = 'center'
    console.log('getWidth(ctx, "拍卖会", "20px")', (60-getWidth(ctx, '拍卖会', '20px'))/2)
    fillText.call(ctx, {text:'拍卖会', font: '20px',  x: 33+5, y: 50})

    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(67, 40)
    ctx.lineTo(67, 60)
    ctx.stroke()

    ctx.textAlign = 'left'
    fillText.call(ctx, {text: params.auctionTitle, font: '20px', color: '#666' ,x: 5 + 62 + 5, y: 50})

    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(5, 60)
    ctx.lineTo(370, 60)
    ctx.stroke()

    //拍品序号
    ctx.textAlign = 'center'
    fillText.call(ctx, {text:'拍品序号', font: '20px',  x: 5 + 30.5, y: 82.5})
    fillText.call(ctx, {text: params.auctionVehicleOrder, font: '20px', color: '#666' ,x: 5 + 61 + 30.5, y: 82.5})
    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(67+61, 60)
    ctx.lineTo(67+61, 105)
    ctx.stroke()

    //品牌型号
    fillText.call(ctx, {text:'品牌型号', font: '20px',  x: 5 + 61*2 + 30.5, y: 82.5})
    // fillText.call(ctx, {text: params.vechileNameAll, font: '20px', color: '#666' ,x: 5 + 61*3 + 91, y: 82.5})
    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(5 + 61*3, 60)
    ctx.lineTo(5 + 61*3, 105)
    ctx.stroke()
    
    


    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(67, 60)
    ctx.lineTo(67, 105)
    ctx.stroke()

    ctx.strokeStyle = '#000'
    ctx.beginPath()
    ctx.lineTo(5, 105)
    ctx.lineTo(370, 105)
    ctx.stroke()
    

    

    // Draw line under text
    // var text = ctx.measureText('Awesome!')
    // ctx.strokeStyle = '#f60'
    // ctx.beginPath()
    // ctx.lineTo(50, 102)
    // ctx.lineTo(50 + text.width, 102)
    // ctx.stroke()


    const data = await promisify(canvas.toDataURL).call(canvas, 'image/jpeg', 1);
    this.ctx.body = data

  }
}

module.exports = HomeController;
