define(function(){
    var instance = null;

    function Util(){
        if(instance !== null){
            throw new Error("Cannot instantiate more than one Util, use Util.getInstance()");
        } 
        
        this.initialize();
    }

    Util.prototype = {
        initialize: function(){
            this.cloneCanvas = function(oldCanvas) {
                var newCanvas = document.createElement('canvas');
                var context = newCanvas.getContext('2d');

                newCanvas.width = oldCanvas.width;
                newCanvas.height = oldCanvas.height;

                context.drawImage(oldCanvas, 0, 0);

                return newCanvas;
            };
        }
    };
    
    Util.getInstance = function(){ 
        if(instance === null){
            instance = new Util();
        }
        return instance;
    };

    return Util.getInstance();
});