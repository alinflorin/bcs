using Bcs.Api.Dto;
using Bcs.Api.Models;
using Bcs.Api.Services.Interfaces;
using Qdrant.Client;
using Qdrant.Client.Grpc;

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

        public async Task DeleteCollection(string name, CancellationToken ct = default)
        {
            await _qdrantClient.DeleteCollectionAsync(name, cancellationToken: ct);
        }

        public async Task<IEnumerable<VectorCollectionDto>> GetCollections(CancellationToken ct = default)
        {
            var colNames = await _qdrantClient.ListCollectionsAsync(ct);
            var infoTasks = colNames.Select(c => (Func<Task<CollectionInfo>>)(() => _qdrantClient.GetCollectionInfoAsync(c, ct)));
            var infos = await infoTasks.WhenAllLimited(10, ct);
            var dtos = new List<VectorCollectionDto>();
            for (var i = 0; i < colNames.Count; i++)
            {
                var dto = new VectorCollectionDto { 
                    Name = colNames[i],
                    PointsCount = infos[i].PointsCount
                };
                dtos.Add(dto);
            }
            return dtos;
        }

        public async Task<bool> Healthcheck(CancellationToken ct = default)
        {
            var reply = await _qdrantClient.HealthAsync(ct);
            return reply.Version != null;
        }

        public async Task UpsertPoints(string collectionName, IEnumerable<VectorPoint> points, CancellationToken ct = default)
        {
            var transformedPoints = points.AsParallel()
                .Select(x => new PointStruct
                {
                    Id = (ulong)x.Id,
                    Vectors = x.Vectors,
                    Payload =
                    {
                        ["fileName"] = x.FileName,
                        ["chunkIndex"] = x.ChunkIndex,
                        ["batchIndex"] = x.BatchIndex,
                        ["text"] = x.Text
                    }
                })
                .ToList();
            await _qdrantClient.UpsertAsync(collectionName, transformedPoints, cancellationToken: ct);
        }
    }
}
