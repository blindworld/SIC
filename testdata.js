/**
 * @license SIC/XE using Angular.js
 * (c) 2013 Geoffrey Kimble
 * License: MIT
 */

/*
 Test data for the assembler.
 */
angular.module('sicAssembler').factory('testData', function() {
    return [
        {
            name: 'Short',
            test:
                "short    start    2000\n" +
                "         lda      five              load 5 into register a\n" +
                "         sta      alpha             store in alpha\n" +
                "         ldch     charz             load 'z' into register a\n" +
                "         stch     c1                store in char var c1\n" +
                "charz    byte     c'Z'              one-byte const\n" +
                "alpha    resw     1                 one-word var\n" +
                "five     word     5                 one-word const\n" +
                "c1       resb     1                 one-byte var\n" +
                "         end      short",

            result:
                "Hshort 002000000014\n" +
                "T0020000D0020100C200D50200C5420135A\n" +
                "T00201003000005\n" +
                "E002000",

            requiresXE: false
        },
        /*
         The demo test downloaded from the SIC Assembler in Canvas.
         */
        {
            name: "Test from SIC Assembler",
            test:
                "test       start   1000              test program for sic software\n" +
                "first      stl     retadr            save return address\n" +
                "cloop      jsub    rdrec             read input record\n" +
                "           lda     length            test for eof (length = 0\n" +
                "           comp    one                 plus eol or eof)\n" +
                "           jeq     endfil            exit if eof found\n" +
                "           jsub    wrrec             write output record\n" +
                "           j       cloop             loop\n" +
                "endfil     lda     eof               insert end of file marker\n" +
                "           sta     buffer\n" +
                "           lda     three             set length = 3\n" +
                "           sta     length\n" +
                "           jsub    wrrec             write eof\n" +
                "           ldl     retadr            get return address\n" +
                "           rsub                      return to caller\n" +
                "eof        byte    c'EOF'\n" +
                "three      word    3\n" +
                "zero       word    0\n" +
                "one        word    1\n" +
                "five       word    5\n" +
                "retadr     resw    1\n" +
                "length     resw    1\n" +
                "buffer     resb    4096              4096-byte buffer area\n" +
                ".\n" +
                ".       subroutine to read record into buffer\n" +
                ".\n" +
                "rdrec      ldx     zero              clear loop counter\n" +
                "           lda     zero              clear a to zero\n" +
                "rloop      td      input             test input device\n" +
                "           jeq     rloop             loop until ready\n" +
                "           rd      input             read character into register a\n" +
                "           comp    five              test for eol or eof\n" +
                "           jlt     exit              exit loop if found\n" +
                "           stch    buffer,x          store character in buffer\n" +
                "           tix     maxlen            loop unless max length\n" +
                "           jlt     rloop                 has been reached\n" +
                "exit       stch    buffer,x          store eol/eof in buffer\n" +
                "           stx     length            save record length\n" +
                "           lda     length            modify record length to include\n" +
                "           add     one                 eol or eof\n" +
                "           sta     length\n" +
                "           rsub                      return to caller\n" +
                "input      byte    x'f3'             code for input device\n" +
                "maxlen     word    4096\n" +
                ".\n" +
                ".       subroutine to write record from buffer\n" +
                ".\n" +
                "wrrec      ldx     zero              clear loop counter\n" +
                "wloop      td      output            test output device\n" +
                "           jeq     wloop             loop until ready\n" +
                "           ldch    buffer,x          get character from buffer\n" +
                "           wd      output            write character\n" +
                "           tix     length            loop until all characters\n" +
                "           jlt     wloop                have been written\n" +
                "           rsub                      return to caller\n" +
                "output     byte    x'06'             code for output device\n" +
                "           end     first",

            result:
                "Htest  00100000108C\n" +
                "T0010001E14103948203F00103C2810333010154820733C100300102A0C103F00102D\n" +
                "T00101E1B0C103C4820730810394C0000454F46000003000000000001000005\n" +
                "T00203F1E041030001030E0206F302045D8206F28103638205D54903F2C2070382045\n" +
                "T00205D1C54903F10103C00103C1810330C103C4C0000F3001000041030E0208B\n" +
                "T0020791330207650903FDC208B2C103C3820764C000006\n" +
                "E001000\n",

            requiresXE: false
        },
        /*
         The same test as above, but in uppercase to verify assembler is case-insensitive.
         */
        {
            name: "Uppercase SIC Assembler test",
            test:
                "TEST       START   1000              TEST PROGRAM FOR SIC SOFTWARE\n" +
                "FIRST      STL     RETADR            SAVE RETURN ADDRESS\n" +
                "CLOOP      JSUB    RDREC             READ INPUT RECORD\n" +
                "           LDA     LENGTH            TEST FOR EOF (LENGTH = 0\n" +
                "           COMP    ONE                 PLUS EOL OR EOF)\n" +
                "           JEQ     ENDFIL            EXIT IF EOF FOUND\n" +
                "           JSUB    WRREC             WRITE OUTPUT RECORD\n" +
                "           J       CLOOP             LOOP\n" +
                "ENDFIL     LDA     EOF               INSERT END OF FILE MARKER\n" +
                "           STA     BUFFER\n" +
                "           LDA     THREE             SET LENGTH = 3\n" +
                "           STA     LENGTH\n" +
                "           JSUB    WRREC             WRITE EOF\n" +
                "           LDL     RETADR            GET RETURN ADDRESS\n" +
                "           RSUB                      RETURN TO CALLER\n" +
                "EOF        BYTE    C'EOF'\n" +
                "THREE      WORD    3\n" +
                "ZERO       WORD    0\n" +
                "ONE        WORD    1\n" +
                "FIVE       WORD    5\n" +
                "RETADR     RESW    1\n" +
                "LENGTH     RESW    1\n" +
                "BUFFER     RESB    4096              4096-BYTE BUFFER AREA\n" +
                ".\n" +
                ".       SUBROUTINE TO READ RECORD INTO BUFFER\n" +
                ".\n" +
                "RDREC      LDX     ZERO              CLEAR LOOP COUNTER\n" +
                "           LDA     ZERO              CLEAR A TO ZERO\n" +
                "RLOOP      TD      INPUT             TEST INPUT DEVICE\n" +
                "           JEQ     RLOOP             LOOP UNTIL READY\n" +
                "           RD      INPUT             READ CHARACTER INTO REGISTER A\n" +
                "           COMP    FIVE              TEST FOR EOL OR EOF\n" +
                "           JLT     EXIT              EXIT LOOP IF FOUND\n" +
                "           STCH    BUFFER,X          STORE CHARACTER IN BUFFER\n" +
                "           TIX     MAXLEN            LOOP UNLESS MAX LENGTH\n" +
                "           JLT     RLOOP                 HAS BEEN REACHED\n" +
                "EXIT       STCH    BUFFER,X          STORE EOL/EOF IN BUFFER\n" +
                "           STX     LENGTH            SAVE RECORD LENGTH\n" +
                "           LDA     LENGTH            MODIFY RECORD LENGTH TO INCLUDE\n" +
                "           ADD     ONE                 EOL OR EOF\n" +
                "           STA     LENGTH\n" +
                "           RSUB                      RETURN TO CALLER\n" +
                "INPUT      BYTE    X'F3'             CODE FOR INPUT DEVICE\n" +
                "MAXLEN     WORD    4096\n" +
                ".\n" +
                ".       SUBROUTINE TO WRITE RECORD FROM BUFFER\n" +
                ".\n" +
                "WRREC      LDX     ZERO              CLEAR LOOP COUNTER\n" +
                "WLOOP      TD      OUTPUT            TEST OUTPUT DEVICE\n" +
                "           JEQ     WLOOP             LOOP UNTIL READY\n" +
                "           LDCH    BUFFER,X          GET CHARACTER FROM BUFFER\n" +
                "           WD      OUTPUT            WRITE CHARACTER\n" +
                "           TIX     LENGTH            LOOP UNTIL ALL CHARACTERS\n" +
                "           JLT     WLOOP                HAVE BEEN WRITTEN\n" +
                "           RSUB                      RETURN TO CALLER\n" +
                "OUTPUT     BYTE    X'06'             CODE FOR OUTPUT DEVICE\n" +
                "           END     FIRST",

            result:
                "Htest  00100000108C\n" +
                "T0010001E14103948203F00103C2810333010154820733C100300102A0C103F00102D\n" +
                "T00101E1B0C103C4820730810394C0000454F46000003000000000001000005\n" +
                "T00203F1E041030001030E0206F302045D8206F28103638205D54903F2C2070382045\n" +
                "T00205D1C54903F10103C00103C1810330C103C4C0000F3001000041030E0208B\n" +
                "T0020791330207650903FDC208B2C103C3820764C000006\n" +
                "E001000\n",

            requiresXE: false
        },

        /*
         Figure 2.1 from book
         */
        {
            name: "Basic SIC (2.1 in book)",
            test:
                "COPY     START   1000\n" +
                "FIRST    STL     RETADR\n" +
                "CLOOP    JSUB    RDREC\n" +
                "         LDA     LENGTH\n" +
                "         COMP    ZERO\n" +
                "         JEQ     ENDFIL\n" +
                "         JSUB    WRREC\n" +
                "         J       CLOOP\n" +
                "ENDFIL   LDA     EOF\n" +
                "         STA     BUFFER\n" +
                "         LDA     THREE\n" +
                "         STA     LENGTH\n" +
                "         JSUB    WRREC\n" +
                "         LDL     RETADR\n" +
                "         RSUB\n" +
                "EOF      BYTE    C'EOF'\n" +
                "THREE    WORD    3\n" +
                "ZERO     WORD    0\n" +
                "RETADR   RESW    1\n" +
                "LENGTH   RESW    1\n" +
                "BUFFER   RESB    4096\n" +
                ".\n" +
                ".        SUBROUTINE TO READ RECORD INTO BUFFER\n" +
                ".\n" +
                "RDREC    LDX     ZERO\n" +
                "         LDA     ZERO\n" +
                "RLOOP    TD      INPUT\n" +
                "         JEQ     RLOOP\n" +
                "         RD      INPUT\n" +
                "         COMP    ZERO\n" +
                "         JEQ     EXIT\n" +
                "         STCH    BUFFER,X\n" +
                "         TIX     MAXLEN\n" +
                "         JLT     RLOOP\n" +
                "EXIT     STX     LENGTH\n" +
                "         RSUB\n" +
                "INPUT    BYTE    X'F1'\n" +
                "MAXLEN   WORD    4096\n" +
                ".\n" +
                ".        SUBROUTINE TO WRITE RECORD FROM BUFFER\n" +
                ".\n" +
                "WRREC    LDX     ZERO\n" +
                "WLOOP    TD      OUTPUT\n" +
                "         JEQ     WLOOP\n" +
                "         LDCH    BUFFER,X\n" +
                "         WD      OUTPUT\n" +
                "         TIX     LENGTH\n" +
                "         JLT     WLOOP\n" +
                "         RSUB\n" +
                "OUTPUT   BYTE    X'05'\n" +
                "         END      FIRST",

            result:
                "HCOPY  00100000107A\n" +
                "T0010001E1410334820390010362810303010154820613C100300102A0C103900102D\n" +
                "T00101E150C10364820610810334C0000454F46000003000000\n" +
                "T0020391E041030001030E0205D30203FD8205D2810303020575490392C205E38203F\n" +
                "T0020571C1010364C0000F1001000041030E02079302064509039DC20792C1036\n" +
                "T002073073820644C000005\n" +
                "E001000",

            requiresXE: false
        },

        /*
         Simple XE program (Figure 2.5 from book)
         */
        {
            name: "Simple XE test (2.5 in book)",
            test: 
                "copy     start   0\n" +
                "first    stl     retadr\n" +
                "         ldb    #length\n" +
                "         base    length\n" +
                "cloop   +jsub    rdrec\n" +
                "         lda     length\n" +
                "         comp   #0\n" +
                "         jeq     endfil\n" +
                "        +jsub    wrrec\n" +
                "         j       cloop\n" +
                "endfil   lda     eof\n" +
                "         sta     buffer\n" +
                "         lda    #3\n" +
                "         sta     length\n" +
                "        +jsub    wrrec\n" +
                "         j      @retadr\n" +
                "eof      byte    c'EOF'\n" +
                "retadr   resw    1\n" +
                "length   resw    1\n" +
                "buffer   resb    4096\n" +
                ".\n" +
                ".        subroutine to read record into buffer\n" +
                ".\n" +
                "rdrec    clear   x\n" +
                "         clear   a\n" +
                "         clear   s\n" +
                "        +ldt    #4096\n" +
                "rloop    td      input\n" +
                "         jeq     rloop\n" +
                "         rd      input\n" +
                "         compr   a,s\n" +
                "         jeq     exit\n" +
                "         stch    buffer,x\n" +
                "         tixr    t\n" +
                "         jlt     rloop\n" +
                "exit     stx     length\n" +
                "         rsub\n" +
                "input    byte    x'F1'\n" +
                ".\n" +
                ".        subroutine to write record from buffer\n" +
                ".\n" +
                "wrrec    clear   x\n" +
                "         ldt     length\n" +
                "wloop    td      output\n" +
                "         jeq     wloop\n" +
                "         ldch    buffer,x\n" +
                "         wd      output\n" +
                "         tixr    t\n" +
                "         jlt     wloop\n" +
                "         rsub\n" +
                "output   byte    x'05'\n" +
                "         end      first",

            result: 
                "Hcopy  000000001077\n" +
                "T0000001D17202D69202D4B1010360320262900003320074B10105D3F2FEC032010\n" +
                "T00001D130F20160100030F200D4B10105D3E2003454F46\n" +
                "T0010361DB410B400B44075101000E32019332FFADB2013A00433200857C003B850\n" +
                "T0010531D3B2FEA1340004F0000F1B410774000E32011332FFA53C003DF2008B850\n" +
                "T001070073B2FEF4F000005\n" +
                "M00000705\n" +
                "M00001405\n" +
                "M00002705\n" +
                "E000000",

            requiresXE: true
        },

        /*
         Changes buffer to use EQU with math.
         */
        {
            name: "2.5 with additional EQU tests",
            test:
                "copy     start   0\n" +
                "first    stl     retadr\n" +
                "         ldb    #length\n" +
                "         base    length\n" +
                "cloop   +jsub    rdrec\n" +
                "         lda     length\n" +
                "         comp   #0\n" +
                "         jeq     endfil\n" +
                "        +jsub    wrrec\n" +
                "         j       cloop\n" +
                "endfil   lda     eof\n" +
                "         sta     buffer\n" +
                "         lda    #3\n" +
                "         sta     length\n" +
                "        +jsub    wrrec\n" +
                "         j      @retadr\n" +
                "eof      byte    c'EOF'\n" +
                "retadr   resw    1\n" +
                "length   resw    1\n" +
                "vara     equ     4000\n" +
                "varb     equ     96\n" +
                "varc     equ     vara+varb\n" +
                "vard     equ     varc\n" +
                "buffer   resb    vard\n" +
                ".\n" +
                ".        subroutine to read record into buffer\n" +
                ".\n" +
                "rdrec    clear   x\n" +
                "         clear   a\n" +
                "         clear   s\n" +
                "        +ldt    #4096\n" +
                "rloop    td      input\n" +
                "         jeq     rloop\n" +
                "         rd      input\n" +
                "         compr   a,s\n" +
                "         jeq     exit\n" +
                "         stch    buffer,x\n" +
                "         tixr    t\n" +
                "         jlt     rloop\n" +
                "exit     stx     length\n" +
                "         rsub\n" +
                "input    byte    x'F1'\n" +
                ".\n" +
                ".        subroutine to write record from buffer\n" +
                ".\n" +
                "wrrec    clear   x\n" +
                "         ldt     length\n" +
                "wloop    td      output\n" +
                "         jeq     wloop\n" +
                "         ldch    buffer,x\n" +
                "         wd      output\n" +
                "         tixr    t\n" +
                "         jlt     wloop\n" +
                "         rsub\n" +
                "output   byte    x'05'\n" +
                "         end      first",

            result:
                "Hcopy  000000001077\n" +
                "T0000001D17202D69202D4B1010360320262900003320074B10105D3F2FEC032010\n" +
                "T00001D130F20160100030F200D4B10105D3E2003454F46\n" +
                "T0010361DB410B400B44075101000E32019332FFADB2013A00433200857C003B850\n" +
                "T0010531D3B2FEA1340004F0000F1B410774000E32011332FFA53C003DF2008B850\n" +
                "T001070073B2FEF4F000005\n" +
                "M00000705\n" +
                "M00001405\n" +
                "M00002705\n" +
                "E000000",

            requiresXE: true
        },

        /*
         Adding Literals (Figure 2.9 in book)
         */
        {
            name: "Figure 2.9 (Added Literals)",
            test:
                "COPY     START   0\n" +
                "FIRST    STL     RETADR\n" +
                "         LDB    #LENGTH\n" +
                "         BASE    LENGTH\n" +
                "CLOOP   +JSUB    RDREC\n" +
                "         LDA     LENGTH\n" +
                "         COMP   #0\n" +
                "         JEQ     ENDFIL\n" +
                "        +JSUB    WRREC\n" +
                "         J        CLOOP\n" +
                "ENDFIL   LDA    =C'EOF'\n" +
                "         STA     BUFFER\n" +
                "         LDA    #3\n" +
                "         STA     LENGTH\n" +
                "        +JSUB    WRREC\n" +
                "         J      @RETADR\n" +
                "         LTORG\n" +
                "RETADR   RESW    1\n" +
                "LENGTH   RESW    1\n" +
                "BUFFER   RESB    4096\n" +
                "BUFEND   EQU     *\n" +
                "MAXLEN   EQU     BUFEND-BUFFER\n" +
                ".\n" +
                ".        SUBROUTINE TO READ RECORD INTO BUFFER\n" +
                ".\n" +
                "RDREC    CLEAR   X\n" +
                "         CLEAR   A\n" +
                "         CLEAR   S\n" +
                "        +LDT    #MAXLEN\n" +
                "RLOOP    TD      INPUT\n" +
                "         JEQ     RLOOP\n" +
                "         RD      INPUT\n" +
                "         COMPR   A,S\n" +
                "         JEQ     EXIT\n" +
                "         STCH    BUFFER,X\n" +
                "         TIXR    T\n" +
                "         JLT     RLOOP\n" +
                "EXIT     STX     LENGTH\n" +
                "         RSUB\n" +
                "INPUT    BYTE    X'F1'\n" +
                ".\n" +
                ".        SUBROUTINE TO WRITE RECORD FROM BUFFER\n" +
                ".\n" +
                "WRREC    CLEAR   X\n" +
                "         LDT     LENGTH\n" +
                "WLOOP    TD     =X'05'\n" +
                "         JEQ     WLOOP\n" +
                "         LDCH    BUFFER,X\n" +
                "         WD     =X'05'\n" +
                "         TIXR    T\n" +
                "         JLT     WLOOP\n" +
                "         RSUB\n" +
                "         END     FIRST\n",

            result:
                "HCOPY  000000001077\n" +
                "T0000001D17202D69202D4B1010360320262900003320074B10105D3F2FEC032010\n" +
                "T00001D130F20160100030F200D4B10105D3E2003454F46\n" +
                "T0010361DB410B400B44075101000E32019332FFADB2013A00433200857C003B850\n" +
                "T0010531D3B2FEA1340004F0000F1B410774000E32011332FFA53C003DF2008B850\n" +
                "T001070073B2FEF4F000005\n" +
                "M00000705\n" +
                "M00001405\n" +
                "M00002705\n" +
                "E000000",

            requiresXE: true
    },

        /*
         Quick error test for overflow and NOBASE directive
         */
        {
            name: "Errors, test NOBASE",
            test: "" +
                "" +
                "" +
                "error    start    0\n" +
                "         ldb     #var\n" +
                "         base     var\n" +
                "         stch     buffer,x\n" +
                "buffer   resb     5000\n" +
                "         nobase\n" +
                "         ldch     buffer,x\n" +
                "var      resw     1\n" +
                "         end      error",
            result: "",
            requiresXE: true
        }]
});
