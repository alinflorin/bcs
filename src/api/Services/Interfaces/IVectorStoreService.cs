namespace Bcs.Api.Services.Interfaces
{
    public interface IVectorStoreService
    {
        Task<bool> Healthcheck(CancellationToken ct = default);
        Task<IEnumerable<string>> GetCollections(CancellationToken ct = default);
        Task<bool> CollectionExists(string name, CancellationToken ct = default);
    }
}
