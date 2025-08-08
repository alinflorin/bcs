using Bcs.Api.Dto;
using Bcs.Api.Helpers;
using Bcs.Api.Models;
using Bcs.Api.Services.Interfaces;

namespace Bcs.Api.Services
{
    public class AdminService(IVectorStoreService vectorStoreService, ITextExtractorService textExtractorService, AppConfig appConfig, IEmbeddingService embeddingService) : IAdminService
    {
        private readonly IVectorStoreService _vectorStoreService = vectorStoreService;
        private readonly ITextExtractorService _textExtractorService = textExtractorService;
        private readonly AppConfig _appConfig = appConfig;
        private readonly IEmbeddingService _embeddingService = embeddingService;

        public async Task<VectorCollectionDto> CreateCollection(CreateVectorCollectionDto collection, IEnumerable<Models.File> files, CancellationToken ct = default)
        {
            var extractionTasks = files.Select(async file =>
            {
                var text = await _textExtractorService.ConvertPdfToText(file.Content, ct);
                return (file.FileName, text);
            });

            var filesWithText = await Task.WhenAll(extractionTasks);

            await _vectorStoreService.CreateCollection(collection.Name, ct);

            var points = new List<VectorPoint>();
            
            foreach (var (fileName, text) in filesWithText)
            {
                var chunks = StringHelper.ChunkText(text, 1000, 200);
                var i = 0;
                foreach (var chunk in chunks)
                {
                    var vectors = await _embeddingService.GetEmbedding(chunk, ct);
                    var point = new VectorPoint
                    {
                        Id = Guid.NewGuid().ToString(),
                        Payload = new Dictionary<string, string>
                        {
                            {"fileName", fileName },
                            {"chunkIndex", i.ToString() }
                        },
                        Vectors = vectors
                    };
                    i++;
                    points.Add(point);
                }
            }
            // TODO insert points

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
