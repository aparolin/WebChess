define(['modules/PiecesCollection'], function(PiecesCollection){

    var Square = function(x, y, side, piece, ctx){
        this.x = x;
        this.y = y;
        this.side = side;
        this.ctx = ctx;
        this.curPiece = null;

        if (piece !== "none"){
            this.curPiece = piece;
        }

        this.draw();
    }

    Square.prototype.addPiece = function(name){
        var piece = PiecesCollection[name];

        this.ctx.font = (this.side/2).toString() + "px serif";
        var piecePosition = {
            x: this.x * this.side + Math.floor(this.side/4),
            y: this.y * this.side + Math.floor(this.side/2),
        }
        this.ctx.fillText(piece, piecePosition.x, piecePosition.y);

        this.curPiece = name;
    }

    Square.prototype.getSide = function(){
        return this.side;
    }

    Square.prototype.clear = function(){
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(this.x * this.side, this.y * this.side, this.side, this.side);
        this.ctx.strokeRect(this.x * this.side, this.y * this.side, this.side, this.side);
        this.curPiece = null;
        this.ctx.fillStyle = "#000000";
    }

    Square.prototype.draw = function(){
        this.ctx.strokeRect(this.x * this.side, this.y * this.side, this.side, this.side);

        if (this.curPiece){
            this.addPiece(this.curPiece);
        }
    }

    Square.prototype.getPiece = function(){
        return (this.curPiece !== "none") ? this.curPiece : null;
    }

    Square.prototype.hasPiece = function(){
        return !!this.curPiece;
    }

    return Square;
});

