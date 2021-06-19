/**
 * A simple animation library wrapping requestAnim shim by Paul Irish.
 * @author Raj Madhuram
 */

(function() {
        
    // requestAnim shim layer by Paul Irish
    var requestAnimFrame = (function(callback){
        return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
    })();  
    
    var RUNNING = 0,
        PAUSED = 1,
        STOPPED = 2;  
    
    var HANDLER_ACTIVE = 0,
        HANDLER_PAUSED = 1;
    
    function AnimHandler(callback) {
        this.state = HANDLER_ACTIVE;
        this.callback = callback;
    }
    
    AnimHandler.prototype = {
        pause: function() {
            this.state = HANDLER_PAUSED;
        },
        
        resume: function() {
            this.state = HANDLER_ACTIVE;
        },
        
        getHandler: function() {
            return this.callback;
        }
    };
        
    function Anim() { 
        this.handlers = [];
        this.state = STOPPED;
        this.time = 0;
    }
        
    Anim.prototype = {
            
        _handleInternal: function() {
            console.log("handle internal called!");
            
            var scope = this;
            
            for (var i=0; i<this.handlers.length; i++) {
                var thisHandler = this.handlers[i];
                if (thisHandler.state == HANDLER_ACTIVE) {
                    thisHandler.getHandler().call(scope);
                }
            }
            
            if (this.state == RUNNING) {
                requestAnimFrame(function() {
                    scope._handleInternal.call(scope);
                });
            }
        },
        
        start: function() {
            this.state = RUNNING;
            
            var scope = this;
            requestAnimFrame(function() {
                scope._handleInternal.call(scope);
            });
        },
        
        pause: function() {
            console.log("paused");
            this.state = PAUSED;
        },
        
        resume: function() {
            this.start();
        },
        
        stop: function() {
            this.state = STOPPED;
        },
        
        addHandler: function(callback) {
            var handler = new AnimHandler(callback);
            this.handlers.push(handler);
            
            return handler;
        }
    }
    
    if (typeof anim == "undefined") {
        anim = new Anim();
    }
})();