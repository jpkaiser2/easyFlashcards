var terms = [];
var definitions = [];

function generateFlashcards() {
    var input = (document.getElementById("input")).value;

    // Clear terms and definitions arrays each time new flashcards are generated
    terms = [];
    definitions = [];

    parseInput(input);
    createPDF();
}

function parseInput(theInput) {
    const length = theInput.length;

    if (theInput[length - 1] === "*" && theInput[length - 2] === "&") {
        theInput = theInput.slice(0, -2);
    }

    var splitData = theInput.split("*&");

    // Validate the input has pairs of terms and definitions
    for (var i = 0; i < splitData.length; i += 2) {
        if (splitData[i] && splitData[i + 1]) {
            terms.push(splitData[i]);
            definitions.push(splitData[i + 1]);
        }
    }
}


function createPDF() {
    const { jsPDF } = window.jspdf;

    // Create a PDF for the term side of the flashcards
    var termsDoc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3, 5]
    });

    // Create a PDF for the definition side of the flashcards
    var definitionsDoc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3, 5]
    });

    var pageWidth = 5;
    var pageHeight = 3;
    var margin = 0.25; // Set margin around text
    var maxWidth = pageWidth - 2 * margin;

    for (var i = 0; i < terms.length; i++) {
        var currTerm = terms[i];

        // Dynamically adjust font size for longer text
        var fontSize = 12;
        termsDoc.setFontSize(fontSize);

        // Adjust text wrapping based on available width
        var lines = termsDoc.splitTextToSize(currTerm, maxWidth);
        var textHeight = lines.length * (fontSize * 0.0139); // Each line's height

        // If text is too tall for the card, reduce font size and re-wrap
        while (textHeight > pageHeight - 2 * margin && fontSize > 6) {
            fontSize--;
            termsDoc.setFontSize(fontSize);
            lines = termsDoc.splitTextToSize(currTerm, maxWidth);
            textHeight = lines.length * (fontSize * 0.0139);
        }

        // Center the text vertically and horizontally
        var y = (pageHeight - textHeight) / 2 + margin;
        lines.forEach(function(line) {
            var textWidth = termsDoc.getTextWidth(line);
            var x = (pageWidth - textWidth) / 2; // Horizontal center
            termsDoc.text(line, x, y);
            y += fontSize * 0.0139; // Move to the next line (line height)
        });

        // Add a new page if it's not the last term
        if (i < terms.length - 1) {
            termsDoc.addPage();
        }
    }

    for (var i = 0; i < definitions.length; i++) {
        var currDefinition = definitions[i];

        // Dynamically adjust font size for longer text
        var fontSize = 12;
        definitionsDoc.setFontSize(fontSize);

        // Adjust text wrapping based on available width
        var lines = definitionsDoc.splitTextToSize(currDefinition, maxWidth);
        var textHeight = lines.length * (fontSize * 0.0139); // Each line's height

        // If text is too tall for the card, reduce font size and re-wrap
        while (textHeight > pageHeight - 2 * margin && fontSize > 6) {
            fontSize--;
            definitionsDoc.setFontSize(fontSize);
            lines = definitionsDoc.splitTextToSize(currDefinition, maxWidth);
            textHeight = lines.length * (fontSize * 0.0139);
        }

        // Center the text vertically and horizontally
        var y = (pageHeight - textHeight) / 2 + margin;
        lines.forEach(function(line) {
            var textWidth = definitionsDoc.getTextWidth(line);
            var x = (pageWidth - textWidth) / 2; // Horizontal center
            definitionsDoc.text(line, x, y);
            y += fontSize * 0.0139; // Move to the next line (line height)
        });

        // Add a new page if it's not the last definition
        if (i < definitions.length - 1) {
            definitionsDoc.addPage();
        }
    }

    // Save the PDFs
    termsDoc.save("terms.pdf");
    definitionsDoc.save("definitions.pdf");
}
