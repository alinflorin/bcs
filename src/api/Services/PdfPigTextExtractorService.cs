using Bcs.Api.Services.Interfaces;
using System.Text;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;

namespace Bcs.Api.Services
{
    public class PdfPigTextExtractorService : ITextExtractorService
    {
        public async Task<string> ConvertPdfToText(Stream pdfBinary, CancellationToken ct = default)
        {
            var sb = new StringBuilder();
            using (var pdfDocument = PdfDocument.Open(pdfBinary, new ParsingOptions { UseLenientParsing = true }))
            {
                foreach (Page page in pdfDocument.GetPages())
                {
                    var text = ContentOrderTextExtractor.GetText(page, true);
                    sb.Append(text);
                }
            }
            await Task.CompletedTask;
            return sb.ToString();
        }
    }
}
