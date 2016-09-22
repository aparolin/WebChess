define([
    'modules/Square',
    'modules/PiecesCollection',
    'modules/Util'
],function(Square, PiecesCollection, Util){

    var Board = function(numberOfSquares){
        this.isMovingPiece = false;
        this.originSquare = null;
        this.movingPieceName = "";
        this.numberOfSquares = numberOfSquares;

        this.initialSetup = [
            ["rook","knight","bishop","king","queen","bishop","knight","rook"],
            ["pawn","pawn","pawn","pawn","pawn","pawn","pawn","pawn"],
            ["none","none","none","none","none","none","none","none"],
            ["none","none","none","none","none","none","none","none"],
            ["none","none","none","none","none","none","none","none"],
            ["none","none","none","none","none","none","none","none"],
            ["pawn","pawn","pawn","pawn","pawn","pawn","pawn","pawn"],
            ["rook","knight","bishop","king","queen","bishop","knight","rook"]
        ];

        this.squares = [[],[],[],[],[],[],[],[]];
    }

    Board.prototype._startMovingPiece = function(mouseX, mouseY){
        var boardPosition = this.coords2BoardPosition(mouseX, mouseY);
        var square = this.squares[boardPosition.y][boardPosition.x];
        
        var piece = square.getPiece(); 
        if (piece){
            square.clear();

            this.movingPieceName = piece;
            this.originSquare = square;
            this.isMovingPiece = true;
            this.canvasCopy = Util.cloneCanvas(this.canvas);
        }
    }

    Board.prototype._stopMovingPiece = function(mouseX, mouseY){
        this.redraw();
        var boardPosition = this.coords2BoardPosition(mouseX, mouseY);
        var targetSquare = this.squares[boardPosition.y][boardPosition.x];

        if (targetSquare.hasPiece()){
            this.originSquare.addPiece(this.movingPieceName);
        } else{
            targetSquare.addPiece(this.movingPieceName);
        }

        this.isMovingPiece = false;
        this.movingPieceName = "";
        this.canvasCopy = null;
    }

    Board.prototype._setupListeners = function(){

       this.canvas.addEventListener("click", (e) => {
            if (this.isMovingPiece){
                this._stopMovingPiece(e.clientX, e.clientY);
            }else{
                this._startMovingPiece(e.clientX, e.clientY);
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isMovingPiece) {
                this.redraw();
                this.drawPieceOnCursor(e.clientX, e.clientY);
                this.highlightPossibilities();
            }
        });
    }

    Board.prototype._drawBoard = function(){
        for (var x = 0; x < this.numberOfSquares; x++){
            for (var y = 0; y < this.numberOfSquares; y++){
                this.squares[y].push(new Square(x,y, this.canvas.width/this.numberOfSquares, this.initialSetup[y][x], this.ctx));
            }
        }
    }

    Board.prototype.init = function(){
        this.canvas = canvas = document.getElementById('canvas');
        this.canvasCopy = null;
        this.ctx = this.canvas.getContext('2d');

        if (canvas.width !== canvas.height){
            throw new Error("Canvas width should be the same as height!");
        }

        this._drawBoard();
        this._setupListeners();
    }

    Board.prototype.redraw = function(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.canvasCopy,0,0);
    }

    Board.prototype.coords2BoardPosition = function(mouseX, mouseY){
        var squareSide = this.canvas.width/this.numberOfSquares;

        //correct mouse detection weird behavior
        mouseX = (mouseX >= canvas.width) ? canvas.width -1 : mouseX;
        mouseY = (mouseY >= canvas.height) ? canvas.height -1 : mouseY;

        return {
            x: Math.floor(mouseX/squareSide),
            y: Math.floor(mouseY/squareSide),
        }
    }

    Board.prototype.drawPieceOnCursor = function(x, y){
        var piece = PiecesCollection[this.movingPieceName];

        var squareSide = this.canvas.width/this.numberOfSquares;

        this.ctx.font = (squareSide/2).toString() + "px serif";
        this.ctx.fillText(piece, x, y);
    }

    return Board;
});