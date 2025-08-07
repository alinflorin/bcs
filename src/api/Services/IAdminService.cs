using Bcs.Api.Dto;

namespace Bcs.Api.Services
{
    public interface IAdminService
    {
        Task<IEnumerable<VectorCollectionDto>> GetCollections(CancellationToken ct = default);
    }
}
