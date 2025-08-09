using Bcs.Api.Dto;
using Bcs.Api.Helpers;
using Bcs.Api.Models;
using Bcs.Api.Services.Interfaces;

namespace Bcs.Api.Services
{
    public class AdminService(ISettingsService settingsService, IVectorStoreService vectorStoreService, ITextExtractorService textExtractorService, AppConfig appConfig, IEmbeddingService embeddingService) : IAdminService
    {
        private readonly IVectorStoreService _vectorStoreService = vectorStoreService;
        private readonly ITextExtractorService _textExtractorService = textExtractorService;
        private readonly AppConfig _appConfig = appConfig;
        private readonly IEmbeddingService _embeddingService = embeddingService;
        private readonly ISettingsService _settingsService = settingsService;
        public async Task<VectorCollectionDto> CreateVectorCollection(CreateVectorCollectionDto collection, IEnumerable<Models.File> files, CancellationToken ct = default)
        {
            var hasCreatedCollection = false;
            try
            {
                var extractionTasks = files
                    .Select(file => (Func<Task<(string FileName, string Text)>>)(async () =>
                    {
                        var text = await _textExtractorService.ConvertPdfToText(file.Content, ct);
                        return (file.FileName, text);
                    }));

                var filesWithText = await extractionTasks.WhenAllLimited(3, ct);

                var points = new List<VectorPoint>();

                foreach (var (fileName, text) in filesWithText)
                {
                    var chunks = StringHelper.ChunkText(text, 1000, 200);
                    var batchedChunks = chunks.Batch(100);
                    var embeddingTasks = batchedChunks
                        .Select(batch => (Func<Task<IEnumerable<float[]>>>)(() => _embeddingService.GetEmbeddings(batch, ct)));

                    var embeddingResults = await embeddingTasks.WhenAllLimited(5, ct);

                    var chunkId = 0;
                    var id = 0;
                    for (var i = 0; i < embeddingResults.Count; i++)
                    {
                        var batchResults = embeddingResults[i];
                        for (var j = 0; j < batchResults.Count(); j++)
                        {
                            var chunkFloats = batchResults.ElementAt(j);
                            var chunkText = batchedChunks.ElementAt(i).ElementAt(j);
                            points.Add(new VectorPoint
                            {
                                ChunkIndex = chunkId,
                                FileName = fileName,
                                Id = ++id,
                                Vectors = chunkFloats,
                                BatchIndex = i,
                                Text = chunkText
                            });
                            chunkId++;
                        }
                    }
                }

                await _vectorStoreService.CreateCollection(collection.Name, ct);
                hasCreatedCollection = true;

                await _vectorStoreService.UpsertPoints(collection.Name, points, ct);

                var colInfo = await _vectorStoreService.GetCollection(collection.Name, ct);

                return colInfo;
            } catch (Exception)
            {
                if (hasCreatedCollection)
                {
                    try
                    {
                        await _vectorStoreService.DeleteCollection(collection.Name, ct);
                    } catch (Exception)
                    {
                        // ignored
                    }
                }
                throw;
            }
        }

        public async Task<VectorCollectionDto> DeleteVectorCollection(string collectionName, CancellationToken ct = default)
        {
            await _vectorStoreService.DeleteCollection(collectionName, ct);
            return new VectorCollectionDto { 
                Name = collectionName
            };
        }

        public async Task<IEnumerable<VectorCollectionDto>> GetVectorCollections(CancellationToken ct = default)
        {
            return await _vectorStoreService.GetCollections(ct);
        }

        public async Task<SettingsDto> SaveSettings(SettingsDto dto, CancellationToken ct = default)
        {
            return await _settingsService.SaveSettings(dto, ct);
        }

        public async Task<SettingsDto> GetSettings(CancellationToken ct = default)
        {
            return await _settingsService.GetSettings(ct);
        }

    }
}
