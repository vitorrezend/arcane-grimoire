/**
 * Generates a PDF from the character sheet.
 */
function generatePdf() {
    const { jsPDF } = window.jspdf;
    const characterSheet = document.querySelector('.character-sheet');
    const charNameInput = document.getElementById('char-name');
    const charName = charNameInput.value.trim() || 'character_sheet';
    const fileName = `${charName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

    // Use html2canvas to capture the sheet
    html2canvas(characterSheet, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // In case of external images
        logging: true,
        backgroundColor: '#ffffff' // Set a background color
    }).then(canvas => {
        try {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;
            const pdfAspectRatio = pdfWidth / pdfHeight;

            let finalCanvasWidth, finalCanvasHeight;

            // Fit canvas to PDF page
            if (canvasAspectRatio > pdfAspectRatio) {
                finalCanvasWidth = pdfWidth;
                finalCanvasHeight = pdfWidth / canvasAspectRatio;
            } else {
                finalCanvasHeight = pdfHeight;
                finalCanvasWidth = pdfHeight * canvasAspectRatio;
            }

            const x = (pdfWidth - finalCanvasWidth) / 2;
            const y = (pdfHeight - finalCanvasHeight) / 2;

            pdf.addImage(imgData, 'PNG', x, y, finalCanvasWidth, finalCanvasHeight);
            pdf.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('An error occurred while generating the PDF. Please check the console for details.');
        }
    }).catch(error => {
        console.error('Error with html2canvas:', error);
        alert('An error occurred while capturing the sheet. Please check the console for details.');
    });
}
