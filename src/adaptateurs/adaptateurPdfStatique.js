const pdfStatique = `
%PDF-1.3
%�߬�
3 0 obj
<</Type /Page
/Parent 1 0 R
/Resources 2 0 R
/MediaBox [0 0 595.2799999999999727 841.8899999999999864]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 135
>>
stream
0.5670000000000001 w
0 G
BT
/F1 16 Tf
18.3999999999999986 TL
0 g
28.3464566929133888 813.5435433070865656 Td
(Annexe des mesures) Tj
ET
endstream
endobj
1 0 obj
<</Type /Pages
/Kids [3 0 R ]
/Count 1
>>
endobj
5 0 obj
<<
/Type /Font
/BaseFont /Helvetica
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
6 0 obj
<<
/Type /Font
/BaseFont /Helvetica-Bold
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
7 0 obj
<<
/Type /Font
/BaseFont /Helvetica-Oblique
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
8 0 obj
<<
/Type /Font
/BaseFont /Helvetica-BoldOblique
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
9 0 obj
<<
/Type /Font
/BaseFont /Courier
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
10 0 obj
<<
/Type /Font
/BaseFont /Courier-Bold
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
11 0 obj
<<
/Type /Font
/BaseFont /Courier-Oblique
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
12 0 obj
<<
/Type /Font
/BaseFont /Courier-BoldOblique
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
13 0 obj
<<
/Type /Font
/BaseFont /Times-Roman
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
14 0 obj
<<
/Type /Font
/BaseFont /Times-Bold
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
15 0 obj
<<
/Type /Font
/BaseFont /Times-Italic
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
16 0 obj
<<
/Type /Font
/BaseFont /Times-BoldItalic
/Subtype /Type1
/Encoding /WinAnsiEncoding
/FirstChar 32
/LastChar 255
>>
endobj
17 0 obj
<<
/Type /Font
/BaseFont /ZapfDingbats
/Subtype /Type1
/FirstChar 32
/LastChar 255
>>
endobj
18 0 obj
<<
/Type /Font
/BaseFont /Symbol
/Subtype /Type1
/FirstChar 32
/LastChar 255
>>
endobj
2 0 obj
<<
/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]
/Font <<
/F1 5 0 R
/F2 6 0 R
/F3 7 0 R
/F4 8 0 R
/F5 9 0 R
/F6 10 0 R
/F7 11 0 R
/F8 12 0 R
/F9 13 0 R
/F10 14 0 R
/F11 15 0 R
/F12 16 0 R
/F13 17 0 R
/F14 18 0 R
>>
/XObject <<
>>
>>
endobj
19 0 obj
<<
/Producer (jsPDF 2.5.1)
/CreationDate (D:20221118110639+01'00')
>>
endobj
20 0 obj
<<
/Type /Catalog
/Pages 1 0 R
/OpenAction [3 0 R /FitH null]
/PageLayout /OneColumn
>>
endobj
xref
0 21
0000000000 65535 f 
0000000338 00000 n 
0000002155 00000 n 
0000000015 00000 n 
0000000152 00000 n 
0000000395 00000 n 
0000000520 00000 n 
0000000650 00000 n 
0000000783 00000 n 
0000000920 00000 n 
0000001043 00000 n 
0000001172 00000 n 
0000001304 00000 n 
0000001440 00000 n 
0000001568 00000 n 
0000001695 00000 n 
0000001824 00000 n 
0000001957 00000 n 
0000002059 00000 n 
0000002403 00000 n 
0000002489 00000 n 
trailer
<<
/Size 21
/Root 20 0 R
/Info 19 0 R
/ID [ <57787C49160487F28AE3CDD8276BE0BA> <57787C49160487F28AE3CDD8276BE0BA> ]
>>
startxref
2593
%%EOF
`;

const genereAnnexeMesures = () => Promise.resolve(pdfStatique);

module.exports = { genereAnnexeMesures };
