export class Preprocessor {
    constructor(){

    }

    stripComments(rawProgram : string) : string {
        const rawChars = rawProgram.split('');

        const collectedChars = [];

        let inSingleComment = false;
        let inBlockComment = false;
        let inString = false;
        for(let i = 0; i < rawChars.length; i++){
            const char = rawChars[i], nextChar = rawChars[i + 1];

            if(inString){
                if(!inSingleComment && !inBlockComment) collectedChars.push(char);
                if(char == "\"") inString = false;
            } else {
                if(inSingleComment){
                    if(char == "\n"){
                        inSingleComment = false;
                        collectedChars.push(char);
                    } else {
                        continue;
                    }
                } else if(inBlockComment){
                    if(char == "*" && nextChar == "/"){
                        inBlockComment = false;
                        i++;
                    } else {
                        continue;
                    }
                } else if(char == "\"") {
                    inString = true;
                    collectedChars.push(char);
                } else {
                    if(char == "#") {
                        inSingleComment = true;
                    } else if(char == "/" && nextChar == "*"){
                        inBlockComment = true;
                    } else {
                        collectedChars.push(char);
                    }
                }
            }
        }

        return collectedChars.join('')
    }
}