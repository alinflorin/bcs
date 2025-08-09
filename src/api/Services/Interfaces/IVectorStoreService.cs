using Bcs.Api.Dto;
using Bcs.Api.Models;

namespace Bcs.Api.Services.Interfaces
{
    public interface IVectorStoreService
    {
        Task<bool> Healthcheck(CancellationToken ct = default);
        Task<IEnumerable<VectorCollectionDto>> GetCollections(CancellationToken ct = default);
        Task<bool> CollectionExists(string name, CancellationToken ct = default);
        Task CreateCollection(string name, CancellationToken ct = default);
        Task UpsertPoints(string collectionName, IEnumerable<VectorPoint> points, CancellationToken ct = default);
        Task DeleteCollection(string name, CancellationToken ct = default);
        Task<VectorCollectionDto> GetCollection(string name, CancellationToken ct = default);
    }
}
