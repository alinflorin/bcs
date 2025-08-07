using Qdrant.Client;

namespace Bcs.Api.Services
{
    public class QdrantVectorStoreService : IVectorStoreService
    {
        private readonly QdrantClient _qdrantClient;

        public QdrantVectorStoreService(AppConfig config)
        {
            _qdrantClient = new QdrantClient(config.Qdrant!.Hostname, config.Qdrant!.Port, false, config.Qdrant!.ApiKey, TimeSpan.FromSeconds(30));
        }

        public async Task<IEnumerable<string>> GetCollections(CancellationToken ct = default)
        {
            return await _qdrantClient.ListCollectionsAsync(ct);
        }

        public async Task<bool> Healthcheck(CancellationToken ct = default)
        {
            var reply = await _qdrantClient.HealthAsync(ct);
            return reply.Version != null;
        }
    }
}
