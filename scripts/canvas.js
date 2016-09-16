requirejs([ 
    'modules/Board'
    ],function(Board){
    
    function init(){
        var board = new Board(8);

        try{
            board.init();
        }catch(e){
            console.error(e.toString());
        }
    }

    init();
});