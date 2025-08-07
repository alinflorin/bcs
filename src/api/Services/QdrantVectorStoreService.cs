using Bcs.Api.Services.Interfaces;
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

        public async Task<bool> CollectionExists(string name, CancellationToken ct = default)
        {
            return await _qdrantClient.CollectionExistsAsync(name, ct);
        }

        public async Task CreateCollection(string name, int size, CancellationToken ct = default)
        {
            await _qdrantClient.CreateCollectionAsync(name, new Qdrant.Client.Grpc.VectorParams { 
                Distance = Qdrant.Client.Grpc.Distance.Cosine,
                Size = (ulong)size
            }, cancellationToken: ct);
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
