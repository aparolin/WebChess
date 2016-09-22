define([
    'modules/Piece'
], function(Piece){

    var Square = function(x, y, side, piece, ctx){
        this.x = x;
        this.y = y;
        this.side = side;
        this.ctx = ctx;
        this.curPiece = piece;

        this.draw();
    }

    Square.prototype.getPosition = function(){
        return {
            x: this.x,
            y: this.y
        };
    }

    Square.prototype.addPiece = function(piece){
        this.curPiece = piece;
        this.curPiece.draw(this);
    }

    Square.prototype.getSide = function(){
        return this.side;
    }

    Square.prototype.highlight = function(){
        this.draw("green");
    }

    Square.prototype.clear = function(){
        this.curPiece = null;
        this.draw();
    }

    Square.prototype.draw = function(color){
        this.ctx.fillStyle = color || "#FFFFFF";
        this.ctx.fillRect(this.x * this.side, this.y * this.side, this.side, this.side);
        this.ctx.strokeRect(this.x * this.side, this.y * this.side, this.side, this.side);
        this.ctx.fillStyle = "#000000";

        if (this.curPiece){
            this.curPiece.draw(this);
        }
    }

    Square.prototype.getPiece = function(){
        return (this.curPiece !== null) ? this.curPiece : null;
    }

    Square.prototype.hasPiece = function(){
        return !!this.curPiece;
    }

    return Square;
});

