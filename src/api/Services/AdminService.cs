using Bcs.Api.Dto;
using Bcs.Api.Services.Interfaces;

namespace Bcs.Api.Services
{
    public class AdminService(IVectorStoreService vectorStoreService, ITextExtractorService textExtractorService) : IAdminService
    {
        private readonly IVectorStoreService _vectorStoreService = vectorStoreService;
        private readonly ITextExtractorService _textExtractorService = textExtractorService;

        public async Task<VectorCollectionDto> CreateCollection(CreateVectorCollectionDto collection, Stream[] files, CancellationToken ct = default)
        {
            var tasks = new List<Task<string>>(files.Length);
            foreach (var file in files)
            {
                tasks.Add(_textExtractorService.ConvertPdfToText(file));
            }
            var allText = string.Join("\n\n\n", await Task.WhenAll(tasks));
            await _vectorStoreService.CreateCollection(collection.Name, 768, ct);
            return new VectorCollectionDto { Name = collection.Name };
        }

        public async Task<IEnumerable<VectorCollectionDto>> GetCollections(CancellationToken ct = default)
        {
            return (await _vectorStoreService.GetCollections(ct))
                .Select(c => new VectorCollectionDto { Name = c })
                .ToList();

        }
    }
}
