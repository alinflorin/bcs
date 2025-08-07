using Bcs.Api.Dto;
using Bcs.Api.Services.Interfaces;
using System.Text;

namespace Bcs.Api.Services
{
    public class AdminService(IVectorStoreService vectorStoreService, ITextExtractorService textExtractorService) : IAdminService
    {
        private readonly IVectorStoreService _vectorStoreService = vectorStoreService;
        private readonly ITextExtractorService _textExtractorService = textExtractorService;

        public async Task<VectorCollectionDto> CreateCollection(CreateVectorCollectionDto collection, Stream[] files, CancellationToken ct = default)
        {
            var sb = new StringBuilder();
            foreach (var file in files)
            {
                sb.Append(
                    await _textExtractorService.ConvertPdfToText(file)
                    );
                sb.Append("\n\n\n");
            }
            var allText = sb.ToString();
            return new VectorCollectionDto { Name = "asd"};
        }

        public async Task<IEnumerable<VectorCollectionDto>> GetCollections(CancellationToken ct = default)
        {
            return (await _vectorStoreService.GetCollections(ct))
                .Select(c => new VectorCollectionDto { Name = c })
                .ToList();

        }
    }
}
