define([
    'modules/Square',
    'modules/Piece',
    'modules/Util',
    'modules/ColorPicker'
],function(Square, Piece, Util, ColorPicker){

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

    Board.prototype._isSquareAvailable = function(row,col){
        if ((row >= this.squares.length) || (row < 0) ||
            (col >= this.squares[0].length) || (col < 0)){
                return false;
            }
        return (!this.squares[row][col].getPiece());
    }

    Board.prototype._getPawnValidSquares = function(){
        var pawn = this.movingPiece;
        var pawnPosition = pawn.getPosition();
        var square = this._getSquareFromCoords(pawnPosition.x, pawnPosition.y);
        var squarePosition = square.getPosition();

        var availableSquares = [];
        if (pawn.getColor() == "white"){
            if (this._isSquareAvailable(squarePosition.y+1, squarePosition.x)){
                availableSquares.push(this.squares[squarePosition.y+1][squarePosition.x]);
            }
            if ((squarePosition.y == 1) && this._isSquareAvailable(squarePosition.y+2, squarePosition.x)){
                availableSquares.push(this.squares[squarePosition.y+2][squarePosition.x]);
            }
        }else{
            if (this._isSquareAvailable(squarePosition.y-1, squarePosition.x)){
                availableSquares.push(this.squares[squarePosition.y-1][squarePosition.x]);
            }
            if ((squarePosition.y == 6) && this._isSquareAvailable(squarePosition.y-2, squarePosition.x)){
                availableSquares.push(this.squares[squarePosition.y-2][squarePosition.x]);
            }
        }
        return availableSquares;
    }

    Board.prototype._getKnightValidSquares = function(){
        var knight = this.movingPiece;
        var knightPosition = knight.getPosition();
        var square = this._getSquareFromCoords(knightPosition.x, knightPosition.y);
        var squarePosition = square.getPosition();

        var availableSquares = [];
        if (this._isSquareAvailable(squarePosition.y-2, squarePosition.x+1)){
            availableSquares.push(this.squares[squarePosition.y-2][squarePosition.x+1]);
        }
        if (this._isSquareAvailable(squarePosition.y-1, squarePosition.x+2)){
            availableSquares.push(this.squares[squarePosition.y-1][squarePosition.x+2]);
        }
        if (this._isSquareAvailable(squarePosition.y+1, squarePosition.x+2)){
            availableSquares.push(this.squares[squarePosition.y+1][squarePosition.x+2]);
        }
        if (this._isSquareAvailable(squarePosition.y+2, squarePosition.x+1)){
            availableSquares.push(this.squares[squarePosition.y+2][squarePosition.x+1]);
        }
        if (this._isSquareAvailable(squarePosition.y+2, squarePosition.x-1)){
            availableSquares.push(this.squares[squarePosition.y+2][squarePosition.x-1]);
        }
        if (this._isSquareAvailable(squarePosition.y+1, squarePosition.x-2)){
            availableSquares.push(this.squares[squarePosition.y+1][squarePosition.x-2]);
        }
        if (this._isSquareAvailable(squarePosition.y-1, squarePosition.x-2)){
            availableSquares.push(this.squares[squarePosition.y-1][squarePosition.x-2]);
        }
        if (this._isSquareAvailable(squarePosition.y-2, squarePosition.x-1)){
            availableSquares.push(this.squares[squarePosition.y-2][squarePosition.x-1]);
        }
        return availableSquares;
    }

    Board.prototype._highlightValidSquares = function(){
        this.validSquares = [];

        switch(this.movingPiece.getName()){
            case "pawn":
                this.validSquares = this._getPawnValidSquares();
                break;
            case "knight":
                this.validSquares = this._getKnightValidSquares();
                break; 
        }

        for (var i = 0; i < this.validSquares.length; i++){
            this.validSquares[i].draw(ColorPicker.getHexColor("lightGreen"));
        }

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
            this._highlightValidSquares();
            this.originSquare = square;
            this.isMovingPiece = true;
            this.canvasCopy = Util.cloneCanvas(this.canvas);
        }
    }

    Board.prototype._stopMovingPiece = function(mouseX, mouseY){
        var that = this;
        function isTargetValidTargetSquare(square){
            for (var i = 0; i < that.validSquares.length; i++){
                if (square == that.validSquares[i]){
                    return true;
                }
            }
            return false;   
        };

        this.redraw();
        var boardPosition = this.coords2BoardPosition(mouseX, mouseY);
        var targetSquare = this.squares[boardPosition.y][boardPosition.x];

        if (targetSquare.hasPiece() || !isTargetValidTargetSquare(targetSquare)){
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