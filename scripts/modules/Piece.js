define(function(){
    var Piece = function(name, position){
        this.name = name;
        this.position = position;
    }

    Piece.prototype.getName = function(){
        return this.name;
    }

    Piece.prototype.getPosition = function(){
        return this.position;
    }
});