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

        public async Task<VectorCollectionDto> CreateVectorCollection(CreateVectorCollectionDto collection, IEnumerable<Models.File> files, CancellationToken ct = default)
        {
            var hasCreatedCollection = false;
            try
            {
                var extractionTasks = files.Select(async file =>
                {
                    var text = await _textExtractorService.ConvertPdfToText(file.Content, ct);
                    return (file.FileName, text);
                });

                var filesWithText = await Task.WhenAll(extractionTasks);

                var points = new List<VectorPoint>();

                foreach (var (fileName, text) in filesWithText)
                {
                    var chunks = StringHelper.ChunkText(text, 1000, 200);
                    var batchedChunks = chunks.Batch(100);
                    var embeddingTasks = batchedChunks.Select(async b => {
                        return await _embeddingService.GetEmbeddings(b, ct);
                    });
                    var embeddingResults = await Task.WhenAll(embeddingTasks);

                    var chunkId = 0;
                    var id = 0;
                    for (var i = 0; i < embeddingResults.Length; i++)
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

                return new VectorCollectionDto { Name = collection.Name };
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
            var check = await _vectorStoreService.CollectionExists(collectionName, ct);
            if (!check)
            {
                return new VectorCollectionDto
                {
                    Name = collectionName
                };
            }
            await _vectorStoreService.DeleteCollection(collectionName, ct);
            return new VectorCollectionDto { 
                Name = collectionName
            };
        }

        public async Task<IEnumerable<VectorCollectionDto>> GetVectorCollections(CancellationToken ct = default)
        {
            return (await _vectorStoreService.GetCollections(ct))
                .Select(c => new VectorCollectionDto { Name = c })
                .ToList();

        }
    }
}
