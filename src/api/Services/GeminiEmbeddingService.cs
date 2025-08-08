using Bcs.Api.Services.Interfaces;

namespace Bcs.Api.Services
{
    public class GeminiEmbeddingService : IEmbeddingService
    {
        private readonly AppConfig _appConfig;
        public GeminiEmbeddingService(AppConfig appConfig)
        {
            _appConfig = appConfig;
        }

        public async Task<float[]> GetEmbedding(string content, CancellationToken ct = default)
        {
            throw new NotImplementedException();
            // TODO
        }
    }
}
