/*
 Utility functions for the assembler.
 */
angular.module('sicAssembler').factory('asmUtil', function() {
    return {
        /*
         Returns the opcode table as an array of objects
         */
        getOpcodeTable: function() {
            return [
                { mnemonic: 'ADD', opcode: '18', format: [3, 4], xeOnly: false },
                { mnemonic: 'ADDF', opcode: '58', format: [3, 4], xeOnly: true },
                { mnemonic: 'ADDR', opcode: '90', format: [2], xeOnly: true },
                { mnemonic: 'AND', opcode: '40', format: [3, 4], xeOnly: false },
                { mnemonic: 'CLEAR', opcode: 'B4', format: [2], xeOnly: true },
                { mnemonic: 'COMP', opcode: '28', format: [3, 4], xeOnly: false },
                { mnemonic: 'COMPF', opcode: '88', format: [3, 4], xeOnly: true },
                { mnemonic: 'COMPR', opcode: 'A0', format: [2], xeOnly: true },
                { mnemonic: 'DIV', opcode: '24', format: [3, 4], xeOnly: false },
                { mnemonic: 'DIVF', opcode: '64', format: [3, 4], xeOnly: true },
                { mnemonic: 'DIVR', opcode: '9C', format: [2], xeOnly: true },
                { mnemonic: 'FIX', opcode: 'C4', format: [1], xeOnly: true },
                { mnemonic: 'FLOAT', opcode: 'C0', format: [1], xeOnly: true },
                { mnemonic: 'HIO', opcode: 'F4', format: [1], xeOnly: true },
                { mnemonic: 'J', opcode: '3C', format: [3, 4], xeOnly: false },
                { mnemonic: 'JEQ', opcode: '30', format: [3, 4], xeOnly: false },
                { mnemonic: 'JGT', opcode: '34', format: [3, 4], xeOnly: false },
                { mnemonic: 'JLT', opcode: '38', format: [3, 4], xeOnly: false },
                { mnemonic: 'JSUB', opcode: '48', format: [3, 4], xeOnly: false },
                { mnemonic: 'LDA', opcode: '00', format: [3, 4], xeOnly: false },
                { mnemonic: 'LDB', opcode: '68', format: [3, 4], xeOnly: true },
                { mnemonic: 'LDCH', opcode: '50', format: [3, 4], xeOnly: false },
                { mnemonic: 'LDF', opcode: '70', format: [3, 4], xeOnly: true },
                { mnemonic: 'LDL', opcode: '08', format: [3, 4], xeOnly: false },
                { mnemonic: 'LDS', opcode: '6C', format: [3, 4], xeOnly: true },
                { mnemonic: 'LDT', opcode: '74', format: [3, 4], xeOnly: true },
                { mnemonic: 'LDX', opcode: '04', format: [3, 4], xeOnly: false },
                { mnemonic: 'LPS', opcode: 'D0', format: [3, 4], xeOnly: true },
                { mnemonic: 'MUL', opcode: '20', format: [3, 4], xeOnly: false },
                { mnemonic: 'MULF', opcode: '60', format: [3, 4], xeOnly: true },
                { mnemonic: 'MULR', opcode: '98', format: [2], xeOnly: true },
                { mnemonic: 'NORM', opcode: 'C8', format: [1], xeOnly: true },
                { mnemonic: 'OR', opcode: '44', format: [3, 4], xeOnly: false },
                { mnemonic: 'RD', opcode: 'D8', format: [3, 4], xeOnly: false },
                { mnemonic: 'RMO', opcode: 'AC', format: [2], xeOnly: true },
                { mnemonic: 'RSUB', opcode: '4C', format: [3, 4], xeOnly: false },
                { mnemonic: 'SHIFTL', opcode: 'A4', format: [2], xeOnly: true },
                { mnemonic: 'SHIFTR', opcode: 'A8', format: [2], xeOnly: true },
                { mnemonic: 'SIO', opcode: 'F0', format: [1], xeOnly: true },
                { mnemonic: 'SSK', opcode: 'EC', format: [3, 4], xeOnly: true },
                { mnemonic: 'STA', opcode: '0C', format: [3, 4], xeOnly: false },
                { mnemonic: 'STB', opcode: '78', format: [3, 4], xeOnly: true },
                { mnemonic: 'STCH', opcode: '54', format: [3, 4], xeOnly: false },
                { mnemonic: 'STF', opcode: '80', format: [3, 4], xeOnly: true },
                { mnemonic: 'STI', opcode: 'D4', format: [3, 4], xeOnly: true },
                { mnemonic: 'STL', opcode: '14', format: [3, 4], xeOnly: false },
                { mnemonic: 'STS', opcode: '7C', format: [3, 4], xeOnly: true },
                { mnemonic: 'STSW', opcode: 'E8', format: [3, 4], xeOnly: false },
                { mnemonic: 'STT', opcode: '84', format: [3, 4], xeOnly: true },
                { mnemonic: 'STX', opcode: '10', format: [3, 4], xeOnly: false },
                { mnemonic: 'SUB', opcode: '1C', format: [3, 4], xeOnly: false },
                { mnemonic: 'SUBF', opcode: '5C', format: [3, 4], xeOnly: true },
                { mnemonic: 'SUBR', opcode: '94', format: [2], xeOnly: true },
                { mnemonic: 'SVC', opcode: 'B0', format: [2], xeOnly: true },
                { mnemonic: 'TD', opcode: 'E0', format: [3, 4], xeOnly: false },
                { mnemonic: 'TIO', opcode: 'F8', format: [1], xeOnly: true },
                { mnemonic: 'TIX', opcode: '2C', format: [3, 4], xeOnly: false },
                { mnemonic: 'TIXR', opcode: 'B8', format: [2], xeOnly: true },
                { mnemonic: 'WD', opcode: 'DC', format: [3, 4], xeOnly: false }
            ];
        },

        /*
         Determine if an array contains a value.
         */
        arrayContains: function(array, value) {
            for (var i = 0; i < array.length; i++) {
                if (value == array[i]) {
                    return true;
                }
            }
            return false;
        },

        /*
         Parses a line into components
         Returns {
           line: original line text
           label: any labels for the line
           mnemonic: the mnemonic for the operation
           operand: the operand
           comment: any comments on the line
         }
         */
        parseLine: function(line) {
            var originalLine = line.replace(/[\t ]+/g, ' ');
            var parts = originalLine.split(' ');

            if (originalLine.length == 0 || (parts.length > 0 && parts[0].length > 0 && parts[0][0] == '.'))
                 return null;

            var label = parts[0];
            var mnemonic = parts[1];

            delete parts[0];
            delete parts[1];

            noOperands = ["FIX", "FLOAT", "HIO", "NORM", "RSUB", "SIO", "TIO"];

            if (!this.arrayContains(noOperands, operand)) {
                var operand = parts[2];
                delete parts[2];
            }

            var comment = parts.join(' ');

            return { line: originalLine, label: label, mnemonic: mnemonic,  operand: operand,  comment: comment };
        },

        /*
         Processes the BYTE directive, returning the hex representation
         of the value.  Accepts X'FF' for hex, or C'STUFF' for a string.
         */
        processByte: function(operand) {
            var hex = operand.match(/^[xX]'(\w+)'$/);
            if (hex) {
                return hex[1];
            }

            var character = operand.match(/^[cC]'(\w+)'$/);
            if (character) {
                hex = '';
                for (var i = 0; i < character[1].length; i++) {
                    hex += character[1].charCodeAt(i).toString(16);
                }
                return hex;
            }
            return null;
        },

        /*
         Adds two hex values together.
         */
        addHex: function(a, b, bits) {
            var result = (parseInt(a, 16) + parseInt(b, 16)).toString(16);

            if (bits) {
                var maxValue = Math.pow(2, bits).toString(16);

                // check bounds
                if (parseInt(result, 16) > parseInt(maxValue, 16)/2 - 1 ||
                    parseInt(result, 16) < 0-parseInt(maxValue,16)/2) {
                    throw "Overflow Occurred";
                }

                // if negative, take the 2's complement
                if (result < 0) {
                    result = (parseInt(maxValue, 16) + parseInt(result, 16)).toString(16);
                }
            }
            return result;
        },

        /*
         Pads a string to the specified length.
         */
        padString: function(string, length)
        {
            while (string.length < length) {
                string += '\u00A0';
            }
            return string;
        },

        /*
         Pads a hex value with leading zeros.
         */
        padHex: function(string, length)
        {
            string = string.toString();
            while (string.length < length) {
                string = '0' + string.toString();
            }
            return string;
        },

        /*
         Converts a value to hex
         */
        toHex: function(value) {
            var parsed = parseInt(value);
            if (isNaN(parsed))
                parsed;
            return parsed.toString(16);
        },

        /*
         Converts a value to decimal
         */
        toDecimal: function(value) {
            var parsed = parseInt(value, 16);
            if (isNaN(parsed))
                parsed;
            return parsed.toString(10);
        },

        /*
         Compares two arrays of strings, turning differences to red.
         */
        compareResults: function(a, b) {
            var result = [];
            for (var i = 0; i < a.length; i++) {
                result.push('');
                for (var j = 0; j < a[i].length; j++) {
                    try {
                        if (a[i][j].toUpperCase() != b[i][j].toUpperCase()) {
                            result[i] += '<span class="red">' + a[i][j] + '</span>';
                        } else {
                            result[i] += a[i][j];
                        }
                    } catch (e) {
                        result[i] += '<span class="red">' + a[i][j] + '</span>';
                    }
                }
            }

            return result;
        }
    }
});