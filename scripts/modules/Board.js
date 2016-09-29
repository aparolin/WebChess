define([
    'modules/Square',
    'modules/Piece',
    'modules/Util'
],function(Square, Piece, Util){

    var Board = function(numberOfSquares){
        this.isMovingPiece = false;
        this.originSquare = null;
        this.movingPiece = null;
        this.numberOfSquares = numberOfSquares;

        this.initialSetup = [
            ["white.rook","white.knight","white.bishop","white.king","white.queen","white.bishop","white.knight","white.rook"],
            ["white.pawn","white.pawn","white.pawn","white.pawn","white.pawn","white.pawn","white.pawn","white.pawn"],
            ["none","none","none","none","none","none","none","none"],
            ["none","none","none","none","none","none","none","none"],
            ["none","none","none","none","none","none","none","none"],
            ["none","none","none","none","none","none","none","none"],
            ["black.pawn","black.pawn","black.pawn","black.pawn","black.pawn","black.pawn","black.pawn","black.pawn"],
            ["black.rook","black.knight","black.bishop","black.king","black.queen","black.bishop","black.knight","black.rook"]
        ];

        this.squares = [[],[],[],[],[],[],[],[]];
    }

    Board.prototype._getSquareFromCoords = function(x, y){
        var boardPosition = this.coords2BoardPosition(x, y);
        return this.squares[boardPosition.y][boardPosition.x];
    }

    Board.prototype._startMovingPiece = function(mouseX, mouseY){
        var square = this._getSquareFromCoords(mouseX, mouseY);
        
        var piece = square.getPiece(); 
        if (piece){
            square.clear();

            this.movingPiece = piece;
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
            this.originSquare.addPiece(this.movingPiece);
        } else{
            targetSquare.addPiece(this.movingPiece);
        }

        this.isMovingPiece = false;
        this.movingPiece = null;
        this.canvasCopy = null;
    }

    Board.prototype._highlightSquareMouseOver = function(mouseX, mouseY){
        var square = this._getSquareFromCoords(mouseX, mouseY   );

            for (var col in this.squares){
                for (var row in this.squares[col]){
                    if (this.squares[col][row] !== square){
                        this.squares[col][row].draw();
                    }else{
                        this.squares[col][row].highlight();        
                    }
                }
            }
    }

    Board.prototype._correctCanvasOffset = function(clientX, clientY){
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        }
    }

    Board.prototype._setupListeners = function(){

       this.canvas.addEventListener("click", (e) => {
            var correctedMouseCoords = this._correctCanvasOffset(e.clientX, e.clientY);

            if (this.isMovingPiece){
                this._stopMovingPiece(correctedMouseCoords.x, correctedMouseCoords.y);
            }else{
                this._startMovingPiece(correctedMouseCoords.x, correctedMouseCoords.y);
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            var correctedMouseCoords = this._correctCanvasOffset(e.clientX, e.clientY);
            this._highlightSquareMouseOver(correctedMouseCoords.x, correctedMouseCoords.y);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isMovingPiece) {
                this.redraw();
                var correctedMouseCoords = this._correctCanvasOffset(e.clientX, e.clientY);
                this.drawPieceOnCursor(correctedMouseCoords.x, correctedMouseCoords.y);
            }
        });
    }

    Board.prototype._drawBoard = function(){
        for (var x = 0; x < this.numberOfSquares; x++){
            for (var y = 0; y < this.numberOfSquares; y++){
                var piece = null;
                if (this.initialSetup[y][x] !== "none"){
                    var curPiece = this.initialSetup[y][x].split(".");
                    var curPieceColor = curPiece[0];
                    var curPieceName = curPiece[1];
                    piece = new Piece(this.ctx, curPieceName, curPieceColor, {"x": x, "y": y});
                }
                var square = new Square(x,y, this.canvas.width/this.numberOfSquares, piece, this.ctx)
                this.squares[y].push(square);
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
        /*
        var squareSide = this.canvas.width/this.numberOfSquares;

        this.ctx.font = (squareSide/2).toString() + "px serif";
        this.ctx.fillText(this.movingPiece.getSymbol(), x, y);
        */

        this.movingPiece.draw(x,y);
    }

    return Board;
});