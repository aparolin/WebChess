define([
    'modules/PiecesCollection',
    'modules/ColorPicker'
],function(PiecesCollection, ColorPicker){
    var Piece = function(ctx, name, color, position){
        this.ctx = ctx;
        this.name = name;
        this.color = color;
        this.symbol = PiecesCollection[name];
        this.position = position;
    }

    Piece.prototype.getName = function(){
        return this.name;
    }

    Piece.prototype.getPosition = function(){
        return this.position;
    }

    Piece.prototype.getColor = function(){
        return this.color;
    }

    Piece.prototype.draw = function(square, x, y){
        if (typeof arguments[0] == "object"){
            var square = arguments[0];

            var squarePosition = square.getPosition();
            var squareSide = square.getSide();

            this.position = {
                x: square.x * squareSide + Math.floor(squareSide/4),
                y: square.y * squareSide + Math.floor(squareSide/2),
            }
        }else{
            this.position = {
                x: arguments[0],
                y: arguments[1]
            }
        }

        var previousFillStyle = this.ctx.fillStyle;
        var previousStrokeStyle = this.ctx.strokeStyle;

        this.ctx.fillStyle = ColorPicker.getHexColor(this.color);
        this.ctx.strokeStyle = ColorPicker.getHexColor("black");

        this.ctx.font = (squareSide/2).toString() + "px serif";

        this.ctx.fillText(this.symbol, this.position.x, this.position.y);
        if(this.color == "white"){
            this.ctx.strokeText(this.symbol, this.position.x, this.position.y);
        }

        this.ctx.fillStyle = previousFillStyle;
        this.ctx.strokeStyle = previousStrokeStyle;
        
    }

    Piece.prototype.getSymbol = function(){
        return this.symbol;
    }

    return Piece;
});