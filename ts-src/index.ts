import fs from 'fs';
import { Preprocessor } from './preprocessor';
import { Parser } from './parser';
import { Transpiler } from './transpiler';

const inputProgram : string = fs.readFileSync(process.argv[2]).toString();

const preprocessor : Preprocessor = new Preprocessor();
const processedProgram : string = preprocessor.stripComments(inputProgram);

const parser : Parser = new Parser()
const AST : any = parser.parseProgram(processedProgram, false);

const transpiler : Transpiler = new Transpiler();
const program = transpiler.transpile(AST, 'javascript');
fs.copyFileSync('./ts-src/util/transpiler_header.js', './build/util/transpiler_header.js');

const header : string = fs.readFileSync('./build/util/transpiler_header.js').toString();

{
    eval(`${header}\n${program}`)
}