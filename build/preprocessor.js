"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preprocessor = void 0;
var Preprocessor = /** @class */ (function () {
    function Preprocessor() {
    }
    Preprocessor.prototype.stripComments = function (rawProgram) {
        var rawChars = rawProgram.split('');
        var collectedChars = [];
        var inSingleComment = false;
        var inBlockComment = false;
        var inString = false;
        for (var i = 0; i < rawChars.length; i++) {
            var char = rawChars[i], nextChar = rawChars[i + 1];
            if (inString) {
                if (!inSingleComment && !inBlockComment)
                    collectedChars.push(char);
                if (char == "\"")
                    inString = false;
            }
            else {
                if (inSingleComment) {
                    if (char == "\n") {
                        inSingleComment = false;
                        collectedChars.push(char);
                    }
                    else {
                        continue;
                    }
                }
                else if (inBlockComment) {
                    if (char == "*" && nextChar == "/") {
                        inBlockComment = false;
                        i++;
                    }
                    else {
                        continue;
                    }
                }
                else if (char == "\"") {
                    inString = true;
                    collectedChars.push(char);
                }
                else {
                    if (char == "#") {
                        inSingleComment = true;
                    }
                    else if (char == "/" && nextChar == "*") {
                        inBlockComment = true;
                    }
                    else {
                        collectedChars.push(char);
                    }
                }
            }
        }
        return collectedChars.join('');
    };
    return Preprocessor;
}());
exports.Preprocessor = Preprocessor;
