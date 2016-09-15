pieces = {
    "king": "♛",
    "queen": "♚",
    "bishop": "♝",
    "knight": "♞",
    "rook": "♜",
    "pawn": "♟",
    "none": ""
};

var Square = function(x, y, side, piece, ctx){
    this.x = x;
    this.y = y;
    this.side = side;
    this.curPiece = piece;
    this.ctx = ctx;

    this.draw();
}

Square.prototype.addPiece = function(name){
    var piece = pieces[name];

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

var Board = function(numberOfSquares){
    this.isMovingPiece = false;
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

Board.prototype.init = function(){
    this.canvas = canvas = document.getElementById('canvas');
    this.canvasCopy = null;
    this.ctx = this.canvas.getContext('2d');

    if (canvas.width !== canvas.height){
        throw new Error("Canvas width should be the same as height!");
    }

    for (var x = 0; x < this.numberOfSquares; x++){
        for (var y = 0; y < this.numberOfSquares; y++){
            this.squares[y].push(new Square(x,y, this.canvas.width/this.numberOfSquares, this.initialSetup[y][x], this.ctx));
        }
    }

    this.canvas.addEventListener("click", (e) => {

        function cloneCanvas(oldCanvas) {
            //create a new canvas
            var newCanvas = document.createElement('canvas');
            var context = newCanvas.getContext('2d');

            //set dimensions
            newCanvas.width = oldCanvas.width;
            newCanvas.height = oldCanvas.height;

            //apply the old canvas to the new one
            context.drawImage(oldCanvas, 0, 0);

            //return the new canvas
            return newCanvas;
        }

        if (this.isMovingPiece){
            this.isMovingPiece = false;
            this.movingPieceName = "";
            this.canvasCopy = null;
        }else{
            var boardPosition = this.coords2BoardPosition(e.clientX, e.clientY);
            var square = this.squares[boardPosition.y][boardPosition.x];
            
            var piece = square.getPiece(); 
            if (piece){
                this.movingPieceName = piece;
                this.isMovingPiece = true;
                this.canvasCopy = cloneCanvas(this.canvas);
            }
        }
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
        if (this.isMovingPiece) {
            this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.canvasCopy,0,0);
            this.drawPieceOnCursor(e.clientX, e.clientY);
        }
    });
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
    var piece = pieces[this.movingPieceName];

    var squareSide = this.canvas.width/this.numberOfSquares;

    this.ctx.font = (squareSide/2).toString() + "px serif";
    this.ctx.fillText(piece, x, y);
}

function init(){
    var board = new Board(8);

    try{
        board.init();
    }catch(e){
        console.error(e.toString());
    }
}