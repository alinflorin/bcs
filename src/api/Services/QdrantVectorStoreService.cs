using Bcs.Api.Services.Interfaces;
using Qdrant.Client;

namespace Bcs.Api.Services
{
    public class QdrantVectorStoreService : IVectorStoreService
    {
        private readonly QdrantClient _qdrantClient;
        private readonly AppConfig _config;

        public QdrantVectorStoreService(AppConfig config)
        {
            _qdrantClient = new QdrantClient(config.Qdrant!.Hostname, config.Qdrant!.Port, false, config.Qdrant!.ApiKey, TimeSpan.FromSeconds(30));
            _config = config;
        }

        public async Task<bool> CollectionExists(string name, CancellationToken ct = default)
        {
            return await _qdrantClient.CollectionExistsAsync(name, ct);
        }

        public async Task CreateCollection(string name, CancellationToken ct = default)
        {
            await _qdrantClient.CreateCollectionAsync(name, new Qdrant.Client.Grpc.VectorParams
            {
                Distance = Enum.Parse<Qdrant.Client.Grpc.Distance>(_config.Qdrant!.Distance),
                Size = (ulong)_config.Qdrant!.Size
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
