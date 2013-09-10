SIC/XE Assembler
===

Two-Pass Sic Assembler with XE Components

This softare implements a SIC and SIC/XE Assembler using algorithms and operations as described within 
System Software: An Introduction to Systems Programming 3rd Edition by Leland L. Beck.

To use this software, simply verify all files are contained within the same directory, and open Assembler.html in a
modern web browser.  This was tested using Firefox 23 and Chrome 29.  Other browsers should be supported, but IE8 
definitely will not work.

The dropdown allows you to select from tests, some of which correspond to figures within the System Software book.
The checkbox allows you to determine whether you want to assemble using SIC rules, or SIC/XE rules.
The textarea also allows you to paste in assembly code, or write your own freehand.

The Assemble button will fully assemble the program and provide all output.
The Run First/Second Pass button will run the current pass from start to finish.
The Assemble Line button will run the selected line through the current pass.

In SIC Mode, START, END, BYTE, WORD, RESW, and RESB assembler directives are supported.
The END directive requires the operand to match the START label.

In SIC/XE Mode, BASE, NOBASE, EQU, and LTORG directives have been added.
A modification record will be added for each non-relative address.
The EQU directive supports addition and subtraction.
Each command supports * to represent the current location counter.
