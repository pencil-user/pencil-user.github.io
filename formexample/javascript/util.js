/*
Dušan Benašić

dbenasic|at|zoho|dot|com
*/

function isDef(value)
{
    if (typeof value === 'undefined' || value === null) {
        return false;
    }
    else
    {
        return true;
    }
}

function isString(value)
{
    return typeof value === 'string';    
}

function isBoolean(value)
{
    return typeof value === 'boolean';  
}

function isNumber(value)
{
    return typeof value === 'number';
}

function isSymbol(value)
{
    return typeof value === 'symbol';
}

function isObject(value)
{
    var type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}

function isArray(value)
{
    return Array.isArray(value);
}


function emailIsValid (email) 
{
    return /\S+@\S+\.\S+/.test(email)
}

let isBool = isBoolean;

let isNum = isNumber;

let isStr = isString;

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/// isFinite already exists