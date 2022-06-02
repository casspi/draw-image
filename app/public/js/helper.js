module.exports = {
    //画文字
    fillText(opt){
        const { font, color, text, x, y , w, h} = opt
        this.fillStyle = color || '#000'
        this.font = font || '12px'
        this.textBaseline = 'middle'
        this.fillText(text, x, y, w, h)
    },
    //计算宽度
    getWidth(ctx, text, font) {
        ctx.font = font;
        return ctx.measureText(text).width
    },
    //计算行数   这是为了计算行高而做的函数
    getLines(ctx, text, font, width) {
        let texts = text.split("\n");
        let line = 0;
        for (let key in texts) {
            line += Math.ceil(getwidth(ctx, texts[key], font) / width);
        }
        return line;
    }
}