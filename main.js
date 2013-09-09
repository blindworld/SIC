/**
 * @license SIC/XE using Angular.js
 * (c) 2013 Geoffrey Kimble
 * License: MIT
 */

/*
 Controller for the assmebler
 */
angular.module('sicAssembler', ['sic.directives'], function() {})
    .controller('mainCtrl', ['$scope', '$sce', 'testData', 'asmUtil', function($scope, $sce, testData, util) {

        const AReg = "0";
        const XReg = "1";
        const LReg = "2";
        const BReg = "3";
        const SReg = "4";
        const TReg = "5";
        const FReg = "6";
        const PCReg = "8";
        const SWReg = "9";

        /*
         The Operation Code Table (OPTAB) for the assembler.  Includes all
         SIC/XE operations.
         The list was compiled from Appendix A in System Software:
         An Introduction To Systems Programming by Leland L. Beck.
         */
        $scope.opcodes = util.getOpcodeTable();

        /*
         Runs the entire assembly algorithm from start to finish.
         */
        $scope.Assemble = function() {
            if ($scope.assembly) {
                reset();
                var lines = $scope.assembly.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var line = util.parseLine(lines[i]);
                    if (line) {
                        executeFirstPass(line, i);
                    }
                }

                $scope.programLength = $scope.locationCounter;

                for (i = 0; i < $scope.intermediate.length; i++) {
                    executeSecondPass($scope.intermediate[i]);
                }

                $scope.highlightIndex = 0;
                $scope.forcePass = true;
                $scope.currentPass = 'First';
            }
        };


        /*
            Runs the current pass based on the previous run.  This
            allows you to stop between passes to see the intermediate
            output.
         */
        $scope.RunCurrentPass = function () {
            if ($scope.assembly) {
                if ($scope.currentPass === 'First') {
                    reset();
                    var lines = $scope.assembly.split('\n');

                    for (var i = 0; i < lines.length; i++) {
                        var line = util.parseLine(lines[i]);

                        if (line)
                            executeFirstPass(line, i);
                    }

                    $scope.programLength = $scope.locationCounter;
                    $scope.highlightIndex = 0;
                    $scope.forcePass = true;
                    $scope.currentPass = 'Second';
                } else {
                    $scope.object = [];
                    for (i = 0; i < $scope.intermediate.length; i++) {
                        executeSecondPass($scope.intermediate[i]);
                    }
                    $scope.highlightIndex = 0;
                    $scope.forcePass = true;
                    $scope.currentPass = 'First';
                }
            }
        };

        /*
            Runs a single line through the assembly algorithm.
         */
        $scope.AssembleLine = function () {
            if ($scope.assembly) {
                $scope.forcePass = false;

                if ($scope.currentPass === 'First') {
                    if ($scope.highlightIndex == 0) {
                        reset(true);
                    }
                    var line = util.parseLine($scope.selected);
                    if (line) {
                        executeFirstPass(line, $scope.highlightIndex);
                    }
                }
                else {
                    for (var i = 0; i < $scope.intermediate.length; i++) {
                        if ($scope.intermediate[i].index == $scope.highlightIndex) {
                            executeSecondPass($scope.intermediate[i]);
                            break;
                        }
                    }
                }

                $scope.highlightIndex++;
            }
        };

        /*
            { private }
            Parses a single line, populating the symbol table and writing
            to an intermediate string.
         */
        var executeFirstPass = function(line, lineIndex) {
            var intermediate = $scope.intermediate;

            // replace *
            // replace symbols
            // do math.

            if (line.mnemonic.toUpperCase() == 'START') {
                $scope.locationCounter = line.operand;
                intermediate.push({ location: $scope.locationCounter, source: line.line, index: lineIndex });
                if (line.label.length) {
                    $scope.symbols.push({ label: line.label, address: $scope.locationCounter });
                }
            } else if (line.mnemonic.toUpperCase() == 'END') {
                if ($scope.isXeEnabled)
                    addressLiterals(lineIndex);
                intermediate.push({ location: $scope.locationCounter, source: line.line, index: lineIndex });
            } else if (line.mnemonic.toUpperCase() == 'EQU' && $scope.isXeEnabled) {
                intermediate.push({ location: $scope.locationCounter, source: line.line, index: lineIndex });
                line.operand = line.operand ?
                    line.operand.replace(/^\w*(\*)\w*/, util.toDecimal($scope.locationCounter)) :
                    '';
                evaluateEqu(line);
            } else if (line.mnemonic.toUpperCase() == 'LTORG' && $scope.isXeEnabled) {
                addressLiterals(lineIndex);
            } else {
                intermediate.push({ location: $scope.locationCounter, source: line.line, index: lineIndex });
                line.operand = line.operand ? line.operand.replace(/^\w*(\*)\w*/, $scope.locationCounter) : '';

                // check for literals.
                applyLiteral(line.operand);

                if (line.label.length > 0) {
                    for (var i = 0; i < $scope.symbols.length; i++) {
                        if ($scope.symbols[i].label == line.label) {
                            logError(line.label + " is already defined as a symbol.");
                        }
                    }

                    $scope.symbols.push({ label: line.label, address: $scope.locationCounter });
                }

                var opcode = getOpcode(line.mnemonic);

                if (opcode) {
                    if (!$scope.isXeEnabled) {
                        if (opcode.xeOnly) {
                            logError("Operation " + opcode.mnemonic + " is only available in XE mode.");
                        }
                        $scope.locationCounter = util.addHex(opcode.format[0], $scope.locationCounter);
                    } else {
                        // if it has a +, then it's format 4.
                        if (line.mnemonic.match(/^\+\w*$/)) {
                            $scope.locationCounter = util.addHex('4', $scope.locationCounter);
                        } else {
                            $scope.locationCounter = util.addHex(opcode.format[0], $scope.locationCounter);
                        }
                    }
                } else if (line.mnemonic.toUpperCase() == 'WORD') {
                    $scope.locationCounter = util.addHex($scope.locationCounter, 3);
                } else if (line.mnemonic.toUpperCase() == 'RESW') {
                    var value = isNaN(line.operand) ? lookupSymbol(line.operand) : util.toHex(line.operand);
                    $scope.locationCounter = util.addHex($scope.locationCounter, 3 * value);
                } else if (line.mnemonic.toUpperCase() == 'RESB') {
                    value = isNaN(line.operand) ? lookupSymbol(line.operand) : util.toHex(line.operand);
                    $scope.locationCounter = util.addHex($scope.locationCounter, value);
                } else if (line.mnemonic.toUpperCase() == 'BYTE') {
                    var processedByte = util.processByte(line.operand);
                    if (!processedByte) {
                        logError("The value in the BYTE is invalid.");
                    }
                    $scope.locationCounter = util.addHex($scope.locationCounter, (processedByte.length/2).toString(16));
                } else if ($scope.isXeEnabled) {
                    // XE specific instructions
                    if (line.mnemonic.toUpperCase() == 'BASE' || line.mnemonic.toUpperCase() == 'NOBASE') {
                        // do nothing during the 1st pass
                    }
                } else {
                    // invalid operation
                    logError(line.mnemonic + " is not a valid operation");
                }
            }

            $scope.intermediate = intermediate;
        };

        /*
            { private }
            Parses a single line, writing the result to the object file.
         */
        var executeSecondPass = function(intermediate) {
            var line = util.parseLine(intermediate.source);

            if (line.mnemonic.toUpperCase() == 'START') {
                $scope.object.push('H' + util.padString(line.label, 6) +
                    util.padHex(line.operand, 6) +
                    util.padHex(util.addHex($scope.programLength, '-' + line.operand), 6).toUpperCase());
            } else if (line.mnemonic.toUpperCase() == 'END') {
                endTextLine();
                if (line.operand.length) {
                    line.operand = lookupSymbol(line.operand);
                }
                if ($scope.isXeEnabled) {
                    for (var i = 0; i < $scope.MRecords.length; i++) {
                        $scope.object.push($scope.MRecords[i]);
                    }
                }
                $scope.object.push('E' + util.padHex(line.operand, 6));
            } else if (line.mnemonic.toUpperCase() == 'EQU' || line.mnemonic.toUpperCase() == 'LTORG') {
                // EQU is only for the first pass, ignore it here.
            } else if (line.label.toUpperCase() == '*' && $scope.isXeEnabled) {
                // add literal.
                for (var i = 0; i < $scope.literals.length; i++) {
                    if ($scope.literals[i].name == line.mnemonic) {
                        var currentLine = '';
                        if (getLastLine()[0] == 'T' && getLastLine().length + $scope.literals[i].value.length < 70 && getLastLine().indexOf('@@') >= 0) {
                            currentLine = getLastLine() + $scope.literals[i].value;
                        } else {
                            currentLine = 'T' + util.padHex(intermediate.location, 6) + '@@' + $scope.literals[i].value;
                            endTextLine();
                            $scope.object.push(currentLine);
                        }
                        $scope.object[$scope.object.length - 1] = currentLine.toUpperCase();
                    }
                }
            } else {
                var opcode = getOpcode(line.mnemonic);
                var currentInstruction;

                if (opcode) {
                    var format = line.mnemonic.match(/^\+(\w+)$/) ? 4 : opcode.format[0];
                    currentInstruction = processInstruction(opcode, line.operand, intermediate.location, format);
                } else if (line.mnemonic.toUpperCase() == 'WORD') {
                    currentInstruction = util.padHex(util.toHex(line.operand), 6);
                } else if (line.mnemonic.toUpperCase() == 'RESW') {
                    endTextLine();
                } else if (line.mnemonic.toUpperCase() == 'RESB') {
                    endTextLine();
                } else if (line.mnemonic.toUpperCase() == 'BYTE') {
                    var processedByte =  util.processByte(line.operand);
                    if (processedByte) {
                        currentInstruction = processedByte;
                    } else {
                        logError("The value in the BYTE is invalid.");
                    }
                } else if ($scope.isXeEnabled) {
                    if (line.mnemonic.toUpperCase() == 'BASE') {
                        $scope.baseReg = lookupSymbol(line.operand);
                    } else if (line.mnemonic.toUpperCase() == 'NOBASE') {
                        $scope.baseReg = '-1';
                    }
                } else {
                    // invalid operation
                    logError(line.mnemonic + " is not a valid operation");
                }

                if (currentInstruction) {
                    var currentLine = '';
                    if (getLastLine()[0] == 'T' && getLastLine().length + currentInstruction.length < 70 && getLastLine().indexOf('@@') >= 0) {
                        currentLine = getLastLine() + currentInstruction;
                    } else {
                        currentLine = 'T' + util.padHex(intermediate.location, 6) + '@@' + currentInstruction;
                        endTextLine();
                        $scope.object.push(currentLine);
                    }
                    $scope.object[$scope.object.length - 1] = currentLine.toUpperCase();
                }
            }
        };

        /*
            Process a single instruction
         */
        var processInstruction = function(opcode, operand, programCounter, format) {
            // Check for indexed and literals
            if (operand) {
                var indexed = operand.match(/^(\w+),X$/i);

                if (indexed) {
                    operand = indexed[1];
                }

                operand = lookupSymbol(operand);

                var literal = operand.match(/^=[XC]'\w+'$/i);

                if (literal) {
                    for (var i = 0; i < $scope.literals.length; i++) {
                        if (literal[0] == $scope.literals[i].name) {
                            operand = $scope.literals[i].address;
                            break;
                        }
                    }
                }
            }

            var toReturn;

            if (format == 1) {
                // format 1
                toReturn = util.padHex(opcode.opcode, 2);
            } else if (format == 2) {
                // format 2
                var operands = operand.split(',');
                operands[0] = lookupSymbol(operands[0]);
                if (operands.length == 2) {
                    operands[1] = lookupSymbol(operands[1]);
                }
                else {
                    operands[1] = '0';
                }
                toReturn = util.padHex(opcode.opcode, 2) + operands.join('');
            } else if (format == 3) {
                // format 3
                if (opcode.mnemonic.toUpperCase() == 'RSUB') {
                    toReturn = opcode.opcode + "0000";

                    if ($scope.isXeEnabled) {
                        toReturn = util.addHex(toReturn, "30000");
                    }
                } else if (!$scope.isXeEnabled) {
                    if (indexed) {
                        operand = util.addHex(operand, '8000'); // set the X bit.
                    }

                    toReturn = util.padHex(opcode.opcode, 2) + util.padHex(operand, 4);
                } else {
                    var immediate = operand.match(/^#(\w+)$/);
                    var indirect = operand.match(/^@(\w+)$/);
                    var flagBits = "00000";
                    var skipRelative = false;

                    if (immediate) {
                        flagBits = util.addHex(flagBits, "10000");

                        if (!isNaN(immediate[1])) {
                            skipRelative = true;
                            toReturn = util.padHex(opcode.opcode, 2) + util.padHex(util.toHex(immediate[1]), 4);
                            toReturn = util.addHex(toReturn, flagBits);
                        } else {
                            operand = lookupSymbol(immediate[1]);
                        }
                    } else if (indirect) {
                        flagBits = util.addHex(flagBits, "20000");
                        operand = lookupSymbol(indirect[1]);
                    } else if (indexed) {
                        flagBits = util.addHex(flagBits, '38000');
                    }
                    else {
                        flagBits = util.addHex(flagBits, "30000");
                    }

                    if (!skipRelative){
                        toReturn = assignRelativeAddress(opcode, operand, programCounter, flagBits);
                    }
                }
                toReturn = util.padHex(toReturn, 6);
            } else if (format == 4) {
                // format 4
                if (opcode.mnemonic.toUpperCase() == 'RSUB') {
                    toReturn = opcode.opcode + "000000";
                } else {
                    immediate = operand.match(/^#(\w+)$/);
                    indirect = operand.match(/^@(\w+)$/);
                    // set the e bit
                    flagBits = "0100000";
                    var createModification = true;

                    if (immediate) {
                        flagBits = util.addHex(flagBits, "1000000");
                        if (isNaN(immediate[1])) {
                            operand = lookupSymbol(immediate[1]);
                            createModification = false;
                        } else {
                            operand = util.toHex(immediate[1]);
                            createModification = false;
                        }
                    } else if (indirect) {
                        flagBits = util.addHex(flagBits, "2000000");
                        operand = lookupSymbol(indirect[1]);
                    } else {
                        flagBits = util.addHex(flagBits, "3000000");
                    }

                    if (createModification) {
                        addModificationRecord(util.addHex(programCounter, 1), '5');
                    }

                    toReturn = util.padHex(opcode.opcode, 2) + util.padHex(operand, 6);
                    toReturn = util.addHex(toReturn, flagBits);
                }
                toReturn = util.padHex(toReturn, 8);
            } else {
                logError("Invalid format for this opcode.");
            }

            return toReturn.toUpperCase();
        };

        /*
         { private }
         Assigns a relative address to the current operation.
         */
        var assignRelativeAddress = function (opcode, operand, programCounter, flagBits) {
            var toReturn;
            // try program relative
            programCounter = util.addHex(programCounter, '3');
            try {
                var address = util.addHex(operand, '-' + programCounter, 12);
                toReturn = (opcode.opcode + util.padHex(address, 4));
                // set p bit
                flagBits = util.addHex(flagBits, "02000");
                toReturn = util.addHex(toReturn, flagBits);
            } catch (e) {
                // try base relative
                if ($scope.baseReg >= 0) {
                    try {
                        address = util.addHex(operand, '-' + $scope.baseReg, 12);
                        toReturn = (opcode.opcode + util.padHex(address, 4));
                        // set n, i and p bits
                        flagBits = util.addHex(flagBits, "04000");
                        toReturn = util.addHex(toReturn, flagBits);
                    } catch (ex) {
                        logError(opcode.mnemonic + " Requires Format 4 Addressing");
                    }
                } else {
                    logError(opcode.mnemonic + " Requires Format 4 Addressing");
                }
            }
            return toReturn;
        };

        /*
         { private }
         Adds EQU variables to the symtab
         */
        var evaluateEqu = function (line) {
            if (line.label.length) {
                var split = line.operand.match(/^(\w+)([+-])(\w+)$/);
                if (split) {
                    // math required.
                    var a = isNaN(split[1]) ? lookupSymbol(split[1]) : util.toHex(split[1]);
                    var b = isNaN(split[3]) ? lookupSymbol(split[3]) : util.toHex(split[3]);

                    if(split[2] == '+') {
                        line.operand = util.addHex(a, b);
                    } else {
                        line.operand = util.addHex(a, "-" + b);
                    }

                    if (isNaN(util.toDecimal(line.operand))) {
                        logError("The EQU could not be resolved. Check for forward references.")
                    }
                } else {
                    var num = isNaN(line.operand) ? lookupSymbol(line.operand) : util.toHex(line.operand);
                    if (isNaN(util.toDecimal(num))) {
                        logError("The EQU could not be resolved. Check for forward references.")
                    }

                    line.operand = num;
                }
                $scope.symbols.push({ label: line.label, address: line.operand });
            } else {
                logError("The EQU directive requires a label.");
            }
        };

        /*
         { private }
         Returns an entry from the OPTAB for the given mnemonic.
         */
        var getOpcode = function(mnemonic) {
            // if XE, allow for format 4 by removing the +
            if ($scope.isXeEnabled) {
                mnemonic = mnemonic.match(/^\+?(\w+)$/)[1];
            }

            for (var i = 0; i < $scope.opcodes.length; i++) {
                if ($scope.opcodes[i].mnemonic == mnemonic.toUpperCase()) {
                    return $scope.opcodes[i];
                }
            }

            return null;
        };

        /*
         { private }
         resets all of the values to run again.
         */
        var reset = function (preserveHighlight) {
            $scope.symbols = [];
            $scope.literals = [];
            $scope.locationCounter = 0;
            $scope.prevInstructionLength = 0;
            $scope.currentPass = 'First';
            $scope.object = [];
            $scope.intermediate = [];
            $scope.errorMessages = [];
            $scope.forcePass = true;
            $scope.baseReg = '-1';
            $scope.MRecords = [];
            addRegisters();

            if (!preserveHighlight) {
                $scope.highlightIndex = 0;
            }
        };

        /*
         { private }
         Returns the last line in the object file
         */
        var getLastLine = function() {
            return $scope.object[$scope.object.length - 1];
        };

        /*
         { private }
         Adds a modification record to the object code
         */
        var addModificationRecord = function (address, length) {
            var record = "M" + util.padHex(address, 6) + util.padHex(length, 2);
            $scope.MRecords.push(record);
        };

        /*
         { private }
         Checks for a literal and adds one as needed.
         */
        var applyLiteral = function(operand) {
            var match = operand.match(/^=([CX]'\w+')/i);
            if (match) {
                for (var i = 0; i < $scope.literals.length; i++) {
                    if (operand == $scope.literals[i].name)
                        return;
                }
                var value = util.processByte(match[1]);
                $scope.literals.push({
                    name: operand,
                    value: value,
                    length: value.length/2,
                    address: null
                });
            }
        };

        /*
         { private }
         Give all the literals with 'null' addresses an address.
         */
        var addressLiterals = function(lineIndex) {
            for (var i = 0; i < $scope.literals.length; i++) {
                if (!$scope.literals[i].address) {
                    $scope.literals[i].address = $scope.locationCounter;
                    $scope.intermediate.push({ location: $scope.locationCounter, source: "* " + $scope.literals[i].name, index: lineIndex });
                    $scope.locationCounter = util.addHex($scope.locationCounter, $scope.literals[i].length);
                }
            }
        };

        /*
         { private }
         Ends the current text line by writing the length.
         */
        var endTextLine = function() {
            $scope.object[$scope.object.length - 1] =
                getLastLine().replace('@@', util.padHex(util.toHex(getLastLine().length / 2 - 4).toUpperCase(), 2));
        };

        /*
         { private }
         Checks the symbol table and returns the operand
         */
        var lookupSymbol = function (operand) {
            for (var i = 0; i < $scope.symbols.length; i++) {
                if (operand.toLowerCase() == $scope.symbols[i].label.toLowerCase()) {
                    operand = $scope.symbols[i].address;
                    break;
                }
            }
            return operand;
        };

        /*
         { private }
         For the XE processor, adds the registers that can be referenced by name
         */
        var addRegisters = function() {
            if ($scope.isXeEnabled) {
                $scope.symbols.push({ label: 'A', address: AReg });
                $scope.symbols.push({ label: 'X', address: XReg });
                $scope.symbols.push({ label: 'L', address: LReg });
                $scope.symbols.push({ label: 'B', address: BReg });
                $scope.symbols.push({ label: 'S', address: SReg });
                $scope.symbols.push({ label: 'T', address: TReg });
                $scope.symbols.push({ label: 'F', address: FReg });
                $scope.symbols.push({ label: 'PC', address: PCReg });
                $scope.symbols.push({ label: 'SW', address: SWReg });
            }
        };

        /*
         { private }
         Logs an error message to the UI.
         */
        var logError = function(message) {
            $scope.errorMessages.push({ index: $scope.errorMessages.length, message: message });
        };

        reset();

        $scope.tests = testData;

        /*
            On testNumber change, change the assembly code and reset.
         */
        $scope.$watch('test', function(val) {
            var found = false;;

            if (val) {
                for (var i = 0; i < $scope.tests.length; i++) {
                    if (val.name == $scope.tests[i].name) {
                        $scope.assembly = $scope.tests[i].test;
                        $scope.isXeEnabled = $scope.tests[i].requiresXE;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    $scope.assembly = '';
                }
            }
            reset();
        });

        /*
            On highlight index reset, change the current pass.
         */
        $scope.$watch('highlightIndex', function() {
            if ($scope.highlightIndex == 0 && !$scope.forcePass) {
                if ($scope.currentPass === 'Second') {
                    $scope.currentPass = 'First';
                } else {
                    $scope.programLength = $scope.locationCounter;
                    $scope.currentPass = 'Second';
                }
            }
        });

        /*
            Display the object code as HTML.
         */
        $scope.displayObject = function() {
            var result = [];

            if ($scope.test) {
                var expected = $scope.test.result.split('\n');
                result = util.compareResults($scope.object, expected);
            } else {
                result = $scope.object;
            }

            return $sce.trustAsHtml(result.join("</br>"));
        };
}]);
