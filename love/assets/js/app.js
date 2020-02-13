//jQuery 扩展 监听CSS3动画
$.fn.extend({
    animateCssEnd: function (callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.one(animationEnd,callback);
    }
});

var Heart = function(canvas,context){
    this.canvas = canvas;
    this.context = context;
    this.radius = 0;
};
Heart.prototype.drawHeart = function(callback){
    var that = this;
    that.context.globalCompositeOperation = "lighter";
    var gardenObj = new Garden(this.context, this.canvas);
    setInterval(function () {
        gardenObj.render();
    }, Garden.options.growSpeed);
    var heart = new Array();
    var animationTimer = setInterval(function () {
        var bloom = that.getHeartPoint(that.radius);
        var draw = true;
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            gardenObj.createRandomBloom(bloom[0], bloom[1]);
        }
        if (that.radius >= 19) {
            callback();
            clearInterval(animationTimer);
        } else {
            that.radius += 0.2;
        }
    }, 80);
};
Heart.prototype.getHeartPoint = function (angle) {
    var offsetX = this.canvas.width / 2;
    var offsetY = this.canvas.height / 2 - 55;
    var t = angle / Math.PI;
    var x =  10 * (16 * Math.pow(Math.sin(t), 3));
    var y = -9 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
};

var BgHeart = function(canvas,context){
    this.canvas = canvas;
    this.context = context;
    this.x = Math.random()* this.canvas.width;
    this.y = Math.random()* this.canvas.height;
    this.size = Math.random()*2 + 1;
    this.shadowBlur = Math.random() * 10;
    this.speedX = (Math.random()+0.2-0.6) * 8;
    this.speedY = (Math.random()+0.2-0.6) * 8;
    this.speedSize = Math.random()*0.05 + 0.01;
    this.opacity = 1;
    this.vertices = [];
    this.precision = 100;

    for (var i = 0; i < this.precision; i++) {
        var step = (i / this.precision - 0.5) * (Math.PI * 2);
        var vector = {
            x : (15 * Math.pow(Math.sin(step), 3)),
            y : -(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step))
        }
        this.vertices.push(vector);
    }
    this.context.strokeStyle = "red";
    this.context.shadowBlur = 25;
    this.context.shadowColor = "hsla(0, 100%, 60%,0.5)";
}
BgHeart.prototype.draw = function(){
    this.size -= this.speedSize;
    this.x += this.speedX;
    this.y += this.speedY;
    this.context.save();
    this.context.translate(-1000,this.y);
    this.context.scale(this.size, this.size);
    this.context.beginPath();
    for (var i = 0; i < this.precision; i++) {
        var vector = this.vertices[i];
        this.context.lineTo(vector.x, vector.y);
    }
    this.context.globalAlpha = this.size;
    this.context.shadowBlur = Math.round((3 - this.size) * 10);
    this.context.shadowColor = "hsla(0, 100%, 60%,0.5)";
    this.context.shadowOffsetX = this.x + 1000;
    this.context.globalCompositeOperation = "screen"
    this.context.closePath();
    this.context.fill()
    this.context.restore();
};