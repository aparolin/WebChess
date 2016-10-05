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
            ["black.rook","black.knight","black.bishop","black.queen","black.king","black.bishop","black.knight","black.rook"],
            ["black.pawn","black.pawn","black.pawn","black.pawn","black.pawn","black.pawn","black.pawn","black.pawn"],
            ["none","none","none","none","none","none","none","none"],
            ["none","none","none","none","none","none","none","none"],
            ["none","none","none","none","none","none","none","none"],
            ["none","none","none","none","none","none","none","none"],
            ["white.pawn","white.pawn","white.pawn","white.pawn","white.pawn","white.pawn","white.pawn","white.pawn"],
            ["white.rook","white.knight","white.bishop","white.queen","white.king","white.bishop","white.knight","white.rook"]
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

    Board.prototype._getPawnValidSquares = function(piece){
        var pawnPosition = piece.getPosition();
        var square = this._getSquareFromCoords(pawnPosition.x, pawnPosition.y);
        var squarePosition = square.getRowColPosition();
        var row = squarePosition.row;
        var col = squarePosition.col;

        var availableSquares = [];
        if (piece.getColor() == "white"){
            if (this._isSquareAvailable(row-1, col)){
                availableSquares.push(this.squares[row-1][col]);
            }
            if ((row == 6) && this._isSquareAvailable(row-2, col)){
                availableSquares.push(this.squares[row-2][col]);
            }
        }else{
            if (this._isSquareAvailable(row+1, col)){
                availableSquares.push(this.squares[row+1][col]);
            }
            if ((row == 1) && this._isSquareAvailable(row+2, col)){
                availableSquares.push(this.squares[row+2][col]);
            }
        }
        return availableSquares;
    }

    Board.prototype._getKnightValidSquares = function(piece){
        var knightPosition = piece.getPosition();
        var square = this._getSquareFromCoords(knightPosition.x, knightPosition.y);
        var squarePosition = square.getRowColPosition();
        var row = squarePosition.row;
        var col = squarePosition.col;

        var availableSquares = [];
        if (this._isSquareAvailable(row-2, col+1)){
            availableSquares.push(this.squares[row-2][col+1]);
        }
        if (this._isSquareAvailable(row-1, col+2)){
            availableSquares.push(this.squares[row-1][col+2]);
        }
        if (this._isSquareAvailable(row+1, col+2)){
            availableSquares.push(this.squares[row+1][col+2]);
        }
        if (this._isSquareAvailable(row+2, col+1)){
            availableSquares.push(this.squares[row+2][col+1]);
        }
        if (this._isSquareAvailable(row+2, col-1)){
            availableSquares.push(this.squares[row+2][col-1]);
        }
        if (this._isSquareAvailable(row+1, col-2)){
            availableSquares.push(this.squares[row+1][col-2]);
        }
        if (this._isSquareAvailable(row-1, col-2)){
            availableSquares.push(this.squares[row-1][col-2]);
        }
        if (this._isSquareAvailable(row-2, col-1)){
            availableSquares.push(this.squares[row-2][col-1]);
        }
        return availableSquares;
    }

    Board.prototype._checkHorizontalSquares = function(curRow, curCol, direction){
        var availableSquares = [];
        for (var row = curRow; row < this.squares.length && row >= 0; row += direction){
            if (this._isSquareAvailable(row, curCol)){
                availableSquares.push(this.squares[row][curCol]);
            }else{
                break;
            }
        }
        return availableSquares;
    };

    Board.prototype._checkVerticalSquares = function(curRow, curCol, direction){
        var availableSquares = [];
        for (var col = curCol; col < this.squares[0].length && col >= 0; col += direction){
            if (this._isSquareAvailable(curRow, col)){
                availableSquares.push(this.squares[curRow][col]);
            }else{
                break;
            }
        }
        return availableSquares;
    };

    Board.prototype._getRookValidSquares = function(piece){
        var rookPosition = piece.getPosition();
        var square = this._getSquareFromCoords(rookPosition.x, rookPosition.y);
        var squarePosition = square.getRowColPosition();
        var curRow = squarePosition.row;
        var curCol = squarePosition.col;

        var availableSquares = [];
        availableSquares = availableSquares.concat(this._checkHorizontalSquares(curRow, curCol, +1));
        availableSquares = availableSquares.concat(this._checkHorizontalSquares(curRow, curCol, -1));
        availableSquares = availableSquares.concat(this._checkVerticalSquares(curRow, curCol, +1));
        availableSquares = availableSquares.concat(this._checkVerticalSquares(curRow, curCol, -1));
        return availableSquares;
    }

    Board.prototype._checkDiagonalSquares = function(row, col, rowDirection, colDirection){
        var availableSquares = [];
        while (true){
            if (this._isSquareAvailable(row, col)){
                availableSquares.push(this.squares[row][col]);
            }else{
                break;
            }
            row += rowDirection;
            col += colDirection;
        }
        return availableSquares;
    };

    Board.prototype._getBishopValidSquares = function(piece){
        var bishopPosition = piece.getPosition();
        var square = this._getSquareFromCoords(bishopPosition.x, bishopPosition.y);
        var squarePosition = square.getRowColPosition();
        var curRow = squarePosition.row;
        var curCol = squarePosition.col;

        var availableSquares = [];
        availableSquares = availableSquares.concat(this._checkDiagonalSquares(curRow, curCol, +1,+1));
        availableSquares = availableSquares.concat(this._checkDiagonalSquares(curRow, curCol, -1,+1));
        availableSquares = availableSquares.concat(this._checkDiagonalSquares(curRow, curCol, -1,-1));
        availableSquares = availableSquares.concat(this._checkDiagonalSquares(curRow, curCol, +1,-1));
        return availableSquares;
    }

    Board.prototype._getQueenValidSquares = function(piece){
        var queenPosition = piece.getPosition();
        var square = this._getSquareFromCoords(queenPosition.x, queenPosition.y);
        var squarePosition = square.getRowColPosition();
        var curRow = squarePosition.row;
        var curCol = squarePosition.col;

        var availableSquares = [];
        availableSquares = availableSquares.concat(this._checkHorizontalSquares(curRow, curCol, +1));
        availableSquares = availableSquares.concat(this._checkHorizontalSquares(curRow, curCol, -1));
        availableSquares = availableSquares.concat(this._checkVerticalSquares(curRow, curCol, +1));
        availableSquares = availableSquares.concat(this._checkVerticalSquares(curRow, curCol, -1));
        availableSquares = availableSquares.concat(this._checkDiagonalSquares(curRow, curCol, +1,+1));
        availableSquares = availableSquares.concat(this._checkDiagonalSquares(curRow, curCol, -1,+1));
        availableSquares = availableSquares.concat(this._checkDiagonalSquares(curRow, curCol, -1,-1));
        availableSquares = availableSquares.concat(this._checkDiagonalSquares(curRow, curCol, +1,-1));
        return availableSquares;
    }

    Board.prototype._getKingValidSquares = function(piece){
        var board = this;
        function checkNeighborSquare(rowDirection, colDirection){
            if (board._isSquareAvailable(row+rowDirection, col+colDirection)){
                availableSquares.push(board.squares[row+rowDirection][col+colDirection]);
            }
        }

        var kingPosition = piece.getPosition();
        var square = this._getSquareFromCoords(kingPosition.x, kingPosition.y);
        var squarePosition = square.getRowColPosition();
        var row = squarePosition.row;
        var col = squarePosition.col;

        var availableSquares = [];
        checkNeighborSquare(+1,0);
        checkNeighborSquare(+1,+1);
        checkNeighborSquare(0,+1);
        checkNeighborSquare(-1,+1);
        checkNeighborSquare(-1,0);
        checkNeighborSquare(-1,-1);
        checkNeighborSquare(0,-1);
        checkNeighborSquare(+1,-1);
        return availableSquares;
    }

    Board.prototype._highlightValidSquares = function(piece){
        this.validSquares = [];

        switch(this.movingPiece.getName()){
            case "pawn":
                this.validSquares = this._getPawnValidSquares(piece);
                break;
            case "knight":
                this.validSquares = this._getKnightValidSquares(piece);
                break; 
            case "rook":
                this.validSquares = this._getRookValidSquares(piece);
                break;
            case "bishop":
                this.validSquares = this._getBishopValidSquares(piece);
                break;
            case "queen":
                this.validSquares = this._getQueenValidSquares(piece);
                break;
            case "king":
                this.validSquares = this._getKingValidSquares(piece);
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
            this._highlightValidSquares(piece);
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

        return {
            x: Math.floor(mouseX/squareSide),
            y: Math.floor(mouseY/squareSide),
        }
    }

    Board.prototype.drawPieceOnCursor = function(x, y){
        this.movingPiece.draw(x,y);
    }

    return Board;
});