'use strict';
// TODO throw error if length of valenceArray is > 3
// TODO if query contains 'PP', points toward all PP[] variants: PP[about], PP[of], etc.
// TODO do the same fo 'PPing' and distinguish 'PP' and 'PPing'.
class PatternUtils{
    // A.B.C D.E.F G.H.I --> [A.B.C, D.E.F, G.H.I]
    static toValenceArray(string){
        string = string.trim();
        if(_containsWhiteSpace(string)){
            var array = [];
            var iterator = 0;
            for(let i = 0; i < string.length; i++){
                if(_isWhiteSpace(string.charAt(i))){
                    if(iterator !== i){
                        array.push(string.substring(iterator, i));
                    }
                    iterator = i+1;
                }
            }
            array.push(string.substring(iterator, string.length));
            return array;
        }else{
            return [string];
        }
    };
}

function _containsWhiteSpace(string){
    return /\s/.test(string);
}

function _isWhiteSpace(char){
    if(char.length === 1){
        return /\s/.test(char);
    }
}

export default PatternUtils;