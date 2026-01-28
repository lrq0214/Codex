const PDFDocument = require('pdfkit');

async function generatePDF(caseStudy) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // Title
      doc.fontSize(20).font('Helvetica-Bold').text('CASE STUDY', { align: 'center' });
      doc.moveDown(0.5);

      // Project and Client Info
      doc.fontSize(12).font('Helvetica-Bold').text(caseStudy.projectTitle);
      doc.fontSize(10).font('Helvetica').text(`Client: ${caseStudy.clientName}`);
      doc.text(`Consultant: ${caseStudy.consultantName}`);
      doc.moveDown(1);

      // Problem Section
      doc.fontSize(12).font('Helvetica-Bold').text('Problem', { underline: true });
      doc.fontSize(10).font('Helvetica').text(caseStudy.problem, { align: 'justify' });
      doc.moveDown(0.8);

      // Solution Section
      doc.fontSize(12).font('Helvetica-Bold').text('Solution', { underline: true });
      doc.fontSize(10).font('Helvetica').text(caseStudy.solution, { align: 'justify' });
      doc.moveDown(0.8);

      // Impact Section
      doc.fontSize(12).font('Helvetica-Bold').text('Impact', { underline: true });
      doc.fontSize(10).font('Helvetica').text(caseStudy.impact, { align: 'justify' });
      doc.moveDown(0.8);

      // Key Takeaways
      if (caseStudy.keyTakeaways && caseStudy.keyTakeaways.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').text('Key Takeaways', { underline: true });
        doc.fontSize(10).font('Helvetica');
        caseStudy.keyTakeaways.forEach(takeaway => {
          doc.text(`• ${takeaway}`);
        });
      }

      // Footer
      doc.moveDown(1);
      doc.fontSize(9).font('Helvetica').text(
        `Generated on ${new Date().toLocaleDateString()}`,
        { align: 'center', color: '#999999' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generatePDF };
