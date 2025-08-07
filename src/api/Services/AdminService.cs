using Bcs.Api.Dto;
using Qdrant.Client;

namespace Bcs.Api.Services
{
    public class AdminService(QdrantClient qdrantClient) : IAdminService
    {
        private readonly QdrantClient _qdrantClient = qdrantClient;

        public async Task<IEnumerable<CollectionDto>> GetCollections(CancellationToken ct = default)
        {
            return (await _qdrantClient.ListCollectionsAsync())
                .Select(c => new CollectionDto { Name = c })
                .ToList();

        }
    }
}
