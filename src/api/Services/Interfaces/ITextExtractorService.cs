namespace Bcs.Api.Services.Interfaces
{
    public interface ITextExtractorService
    {
        Task<string> ConvertPdfToText(Stream pdfBinary);
    }
}
