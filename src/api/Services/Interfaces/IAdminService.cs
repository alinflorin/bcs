using Bcs.Api.Dto;

namespace Bcs.Api.Services.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<VectorCollectionDto>> GetCollections(CancellationToken ct = default);
        Task<VectorCollectionDto> CreateCollection(CreateVectorCollectionDto collection, IEnumerable<Models.File> files, CancellationToken ct = default);
    }
}
