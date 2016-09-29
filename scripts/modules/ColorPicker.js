define(function(){
    var instance = null;

    function ColorPicker(){
        if(instance !== null){
            throw new Error("Cannot instantiate more than one ColorPicker, use ColorPicker.getInstance()");
        } 
        
        this.initialize();
    }

    ColorPicker.prototype = {
        colors: {
            "lightBlue": "#66bef9",
            "lightGrey": "#e8e8e8",
            "darkGrey": "#c0c0c0",
            "black": "#000000",
            "white": "#FFFFFF"
        },

        initialize: function(){
            this.getHexColor = function(name){
                return this.colors[name];
            }
        }
    };
    
    ColorPicker.getInstance = function(){ 
        if(instance === null){
            instance = new ColorPicker();
        }
        return instance;
    };

    return ColorPicker.getInstance();
});