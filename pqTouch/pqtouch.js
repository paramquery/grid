/*!
 * ParamQuery Touch v1.1.0
 * 
 * Copyright (c) 2012-2026 Paramvir Dhindsa (http://paramquery.com)
 * Released under MIT license
 * 
 */
(function(factory) {
    "use strict";

    const root = typeof window !== 'undefined' ? window : globalThis;

    if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
        // CommonJS
        const jQuery = require("jquery");
        factory(jQuery);
        module.exports = jQuery;
    } else {
        // Browser globals
        if (root && root.jQuery) {
            factory(root.jQuery);
        } else {
            throw new Error("jquery-ui-pack requires jQuery to be loaded first.");
        }
    }
})(function(jQuery) {
    (function($) {
    if (!("ontouchstart" in window)) return;

    function fireMouseEvent(type, touch, target, relatedTarget) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(type, true, true, window, 0, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, relatedTarget);
        target.dispatchEvent(evt);
        return evt
    }

    function touchStart(evt) {
        if (evt.touches.length == 1) {
            var touch = evt.changedTouches[0],
                evtM, target = evt.target;
            fireMouseEvent("mouseover", touch, target);
            fireMouseEvent("mousemove", touch, target);
            evtM = fireMouseEvent("mousedown", touch, target);
            if (evtM.defaultPrevented) {
                target.addEventListener("touchmove", touchMove);
                target.addEventListener("touchend", touchEnd)
            }
        }
    }

    function touchMove(evt) {
        var touch = evt.changedTouches[0],
            target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target) {
            if (prevTarget) {
                if (target && prevTarget !== target) {
                    fireMouseEvent("mouseover", touch, target, prevTarget);
                    fireMouseEvent("mouseout", touch, prevTarget, target);
                    prevTarget = target
                }
            } else {
                prevTarget = target
            }
            evt.preventDefault();
            fireMouseEvent("mousemove", touch, target)
        }
    }

    function touchEnd(evt) {
        var touch = evt.changedTouches[0],
            target = document.elementFromPoint(touch.clientX, touch.clientY),
            targetOrig = evt.target;
        fireMouseEvent("mouseup", touch, target);
        fireMouseEvent("mouseout", touch, target);
        targetOrig.removeEventListener("touchmove", touchMove);
        targetOrig.removeEventListener("touchend", touchEnd)
    }
    var prevTarget, proto = $.ui.mouse.prototype,
        mouseInit = proto._mouseInit,
        mouseDestroy = proto._mouseDestroy;
    proto._mouseInit = function() {
        this.element[0].addEventListener("touchstart", touchStart);
        mouseInit.apply(this, arguments)
    };
    proto._mouseDestroy = function() {
        this.element[0].removeEventListener("touchstart", touchStart);
        mouseDestroy.apply(this, arguments)
    }
})(jQuery);
});