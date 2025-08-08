using Bcs.Api.Dto;
using Bcs.Api.Services.Interfaces;

namespace Bcs.Api.Services
{
    public class AdminService(IVectorStoreService vectorStoreService, ITextExtractorService textExtractorService, AppConfig appConfig) : IAdminService
    {
        private readonly IVectorStoreService _vectorStoreService = vectorStoreService;
        private readonly ITextExtractorService _textExtractorService = textExtractorService;
        private readonly AppConfig _appConfig = appConfig;

        public async Task<VectorCollectionDto> CreateCollection(CreateVectorCollectionDto collection, IEnumerable<Models.File> files, CancellationToken ct = default)
        {
            var extractionTasks = files.Select(async file =>
            {
                var text = await _textExtractorService.ConvertPdfToText(file.Content, ct);
                return (file.FileName, text);
            });

            var filesWithText = await Task.WhenAll(extractionTasks);

            await _vectorStoreService.CreateCollection(collection.Name, ct);

            var semaphore = new SemaphoreSlim(5);
            var insertTasks = new List<Task>();

            foreach (var (fileName, text) in filesWithText)
            {
                var chunks = ChunkText(text, 1000, 200);

                foreach (var chunk in chunks)
                {
                    await semaphore.WaitAsync(ct);

                    var task = Task.Run(async () =>
                    {
                        try
                        {
                            // TODO
                        }
                        finally
                        {
                            semaphore.Release();
                        }
                    }, ct);

                    insertTasks.Add(task);
                }
            }

            // Step 4: Wait for all inserts to finish
            await Task.WhenAll(insertTasks);

            return new VectorCollectionDto { Name = collection.Name };
        }

        public async Task<IEnumerable<VectorCollectionDto>> GetCollections(CancellationToken ct = default)
        {
            return (await _vectorStoreService.GetCollections(ct))
                .Select(c => new VectorCollectionDto { Name = c })
                .ToList();

        }

        private static IEnumerable<string> ChunkText(string text, int chunkSize, int overlap)
        {
            if (string.IsNullOrEmpty(text))
                yield break;

            for (int i = 0; i < text.Length; i += chunkSize - overlap)
            {
                var length = Math.Min(chunkSize, text.Length - i);
                yield return text.Substring(i, length);

                if (i + length >= text.Length)
                    break;
            }
        }
    }
}
