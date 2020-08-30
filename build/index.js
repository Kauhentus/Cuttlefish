"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var preprocessor_1 = require("./preprocessor");
var parser_1 = require("./parser");
var transpiler_1 = require("./transpiler");
var inputProgram = fs_1.default.readFileSync(process.argv[2]).toString();
var preprocessor = new preprocessor_1.Preprocessor();
var processedProgram = preprocessor.stripComments(inputProgram);
var parser = new parser_1.Parser();
var AST = parser.parseProgram(processedProgram, false);
var transpiler = new transpiler_1.Transpiler();
var program = transpiler.transpile(AST, 'javascript');
fs_1.default.copyFileSync('./ts-src/util/transpiler_header.js', './build/util/transpiler_header.js');
var header = fs_1.default.readFileSync('./build/util/transpiler_header.js').toString();
{
    eval(header + "\n" + program);
}
