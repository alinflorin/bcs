using Bcs.Api.Services.Interfaces;
using OpenAI.Embeddings;

namespace Bcs.Api.Services
{
    public class GeminiEmbeddingService : IEmbeddingService
    {
        private readonly AppConfig _appConfig;
        private readonly EmbeddingClient _embeddingClient;
        public GeminiEmbeddingService(AppConfig appConfig)
        {
            _appConfig = appConfig;
            _embeddingClient = new EmbeddingClient(appConfig.Gemini!.EmbeddingModel, new System.ClientModel.ApiKeyCredential(appConfig.Gemini!.ApiKey), new OpenAI.OpenAIClientOptions
            {
                Endpoint = new Uri(appConfig.Gemini!.OpenAiUri)
            });
        }

        public async Task<float[]> GetEmbedding(string content, CancellationToken ct = default)
        {
            var result = await _embeddingClient.GenerateEmbeddingAsync(content);
            return result.Value.ToFloats().ToArray();
        }
    }
}
