"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Viewer = void 0;
var Viewer = /** @class */ (function () {
    function Viewer(rootName, object) {
        this.name = rootName;
        this.object = object;
    }
    Viewer.prototype.render = function () {
        console.log(this.name);
        var stack = function (object, depth, pipeStack) {
            if (pipeStack === void 0) { pipeStack = []; }
            var values = Object.keys(object);
            for (var i = 0; i < values.length; i++) {
                var currentValue = object[values[i]];
                var last = i == values.length - 1;
                var isNode = Array.isArray(currentValue) || typeof (currentValue) == 'object';
                var isLeafFunction = !!(currentValue && currentValue.constructor && currentValue.call && currentValue.apply);
                console.log(pipeStack.join('') +
                    (last ? '└─' : '├─') +
                    values[i] + ': ' + (isNode ? '' : (isLeafFunction ? "[Function: " + currentValue.name + "]" : currentValue)));
                if (isNode)
                    stack(currentValue, depth + 1, __spreadArrays(pipeStack, [last ? '    ' : '|   ']));
            }
        };
        stack(this.object, 0);
    };
    return Viewer;
}());
exports.Viewer = Viewer;
