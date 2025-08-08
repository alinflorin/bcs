namespace Bcs.Api.Dto
{
    public class CreateVectorCollectionFormModel
    {
        public required string CreateVectorCollectionDtoString { get; set; }
        public required List<IFormFile> PdfFiles { get; set; }
    }
}
