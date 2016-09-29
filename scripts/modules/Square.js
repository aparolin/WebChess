define([
    'modules/Piece'
], function(Piece){

    var Square = function(x, y, side, piece, ctx){
        this.x = x;
        this.y = y;
        this.side = side;
        this.ctx = ctx;
        this.curPiece = piece;
        this.color = this.determineColor();

        this.draw();
    }

    Square.prototype.isEvenRow = function(){
        return this.x % 2 == 0;
    }

    Square.prototype.isEvenCoordinate = function(){
        return ((this.x % 2 == 0) && (this.y % 2 == 0));
    }

    Square.prototype.isOddCoordinate = function(){
        return ((this.x % 2 != 0) && (this.y % 2 != 0));
    }

    Square.prototype.determineColor = function(){
        if (this.isEvenRow()){
            if (this.isEvenCoordinate()){
                return "#c0c0c0"
            }else{
                return "#e8e8e8"
            }    
        }else{
            if (this.isOddCoordinate()){
                return "#c0c0c0"
            }else{
                return "#e8e8e8"
            }
        }
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
        this.ctx.fillStyle = color || this.color;
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

