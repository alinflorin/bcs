namespace Bcs.Api.Services
{
    public interface IVectorStoreService
    {
        Task<bool> Healthcheck(CancellationToken ct = default);
        Task<IEnumerable<string>> GetCollections(CancellationToken ct = default);
        Task<bool> CollectionExists(string name, CancellationToken ct = default);
    }
}
