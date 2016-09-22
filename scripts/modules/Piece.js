define([
    'modules/PiecesCollection'
],function(PiecesCollection){
    var Piece = function(ctx, name, position){
        this.ctx = ctx;
        this.name = name;
        this.symbol = PiecesCollection[name];
        this.position = position;
    }

    Piece.prototype.getName = function(){
        return this.name;
    }

    Piece.prototype.getPosition = function(){
        return this.position;
    }

    Piece.prototype.draw = function(square){
        var squarePosition = square.getPosition();
        var squareSide = square.getSide();

        this.ctx.font = (squareSide/2).toString() + "px serif";

        this.position = {
            x: square.x * squareSide + Math.floor(squareSide/4),
            y: square.y * squareSide + Math.floor(squareSide/2),
        }

        this.ctx.fillText(this.symbol, this.position.x, this.position.y);
    }

    Piece.prototype.getSymbol = function(){
        return this.symbol;
    }

    return Piece;
});