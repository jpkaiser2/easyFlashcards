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
    var splitData = theInput.split("*&");

    for (var i = 0; i < splitData.length; i += 2) {
        terms.push(splitData[i]);
        definitions.push(splitData[i + 1]);
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

    for (var i = 0; i < terms.length; i++) {
        var pageWidth = 5;
        var pageHeight = 3;
        var currTerm = terms[i];

        // Center text
        var textWidth = termsDoc.getTextWidth(currTerm);
        var x = (pageWidth - textWidth) / 2;
        var y = pageHeight / 2;

        termsDoc.setFontSize(12);

        termsDoc.text(currTerm, x, y, { align: "center" });

        // Add a new page if it's not the last term
        if (i < terms.length - 1) {
            termsDoc.addPage();
        }
    }

    for (var i = 0; i < definitions.length; i++) {
        var pageWidth = 5;
        var pageHeight = 3;

        var currDefinition = definitions[i];

        // Center text
        var textWidth = definitionsDoc.getTextWidth(currDefinition);
        var x = (pageWidth - textWidth) / 2;
        var y = pageHeight / 2;

        definitionsDoc.setFontSize(12);

        definitionsDoc.text(currDefinition, x, y, { align: "center" });

        // Add a new page if it's not the last term
        if (i < terms.length - 1) {
            definitionsDoc.addPage();
        }
    }

    // Save the PDFs
    termsDoc.save("terms.pdf");
    definitionsDoc.save("definitions.pdf");
}
