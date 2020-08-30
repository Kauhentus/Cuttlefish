"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var nearley_1 = __importDefault(require("nearley"));
var viewer_1 = require("./util/viewer");
var grammar_1 = __importDefault(require("./util/grammar"));
var Parser = /** @class */ (function () {
    function Parser() {
        // @ts-ignore
        this.parser = new nearley_1.default.Parser(nearley_1.default.Grammar.fromCompiled(grammar_1.default));
        this.parseTree;
    }
    Parser.prototype.parseProgram = function (rawProgram, view) {
        if (view === void 0) { view = false; }
        this.parser.feed(rawProgram);
        this.parseTree = this.parser.results[0];
        if (view) {
            new viewer_1.Viewer('Program', this.parseTree).render();
            console.log(this.parser.results.map(function (v) { return JSON.stringify(v).length; }));
        }
        return this.parseTree;
    };
    return Parser;
}());
exports.Parser = Parser;
