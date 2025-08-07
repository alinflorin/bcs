using Bcs.Api.Dto;

namespace Bcs.Api.Services
{
    public interface IAdminService
    {
        Task<IEnumerable<CollectionDto>> GetCollections(CancellationToken ct = default);
    }
}
