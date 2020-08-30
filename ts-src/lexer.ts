import moo from 'moo';
const IndentifyLexer = require("@shieldsbetter/nearley-indentify");

const lexer = new IndentifyLexer(moo.compile({
    boolean: /true|false/,
    keywords: /with|while|do|import|as|from|export|default|return|external/,
    number: /[0-9]+(?:\.[0-9]+)?/,
    word: /[a-zA-Z_][0-9a-zA-Z_]*/,
    string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,

    nl: { match: /(?:\r\n?|\n)+/, lineBreaks: true },
    ws: /[ \t]+/,
    double_escape: /\\\\/,
    all: /\\&/,
    any: /\\\|/,
    reduce_right: /\\>/,
    reduce_left: /\\</,
    long_operation: />>=|<\$>|<\*>|=>|\.\.|==|!=|<=|>=|&&|\|\||\^\^|\*\*|<-|\+=|-=|\*=|\/=|%=|=:/,
    unary_operation: /!/,
    operation:  /\~|'|\+|-|\*|\/|%|=|~|<|>|@|\.|\$/,
    symbol: /[,|:\[\]{}?\(\)]/,
}));

export default lexer;