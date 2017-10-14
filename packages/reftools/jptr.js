'use strict';

function jpescape(s) {
    s = s.split('~').join('~0');
    s = s.split('/').join('~1');
    return s;
}

function jpunescape(s) {
    s = s.split('~1').join('/');
    s = s.split('~0').join('~');
    return s;
}

// JSON Pointer specification: http://tools.ietf.org/html/rfc6901

/**
* from obj, return the property with a JSON Pointer prop, optionally setting it
* to newValue
*/
function jptr(obj, prop, newValue) {
    if (typeof obj === 'undefined') return false;
    if (!prop || (prop === '#')) return obj; // doesn't return newValue

    if (prop.startsWith('#')) prop = prop.slice(1);
    if (prop.startsWith('/')) prop = prop.slice(1);

    let components = prop.split('/');
    for (let i=0;i<components.length;i++) {
        components[i] = jpunescape(components[i]);

        let index = -1;
        let setAndLast = (typeof newValue !== 'undefined') && (i == components.length);

        index = parseInt(components[i],10);
        if (isNaN(index)) {
            index = -1;
        }
        else {
            components[i] = (i > 0) ? components[i-1] : ''; // backtrack to indexed property name
        }

        if (obj.hasOwnProperty(components[i])) {
            if (index >= 0) {
                if (setAndLast) {
                    components[i][index] = newValue;
                }
                obj = obj[components[i][index]];
            }
            else {
                if (setAndLast) {
                    obj[components][i] = newValue;
                }
                obj = obj[components[i]];
            }
        }
        else return false;
    }
    return obj;
}

module.exports = {
    jptr : jptr,
    jpescape : jpescape,
    jpunescape : jpunescape
};