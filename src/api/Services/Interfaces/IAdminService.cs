using Bcs.Api.Dto;

namespace Bcs.Api.Services.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<VectorCollectionDto>> GetVectorCollections(CancellationToken ct = default);
        Task<VectorCollectionDto> CreateVectorCollection(CreateVectorCollectionDto collection, IEnumerable<Models.File> files, CancellationToken ct = default);
        Task<VectorCollectionDto> DeleteVectorCollection(string collectionName, CancellationToken ct = default);
        Task<SettingsDto> SaveSettings(SettingsDto dto, CancellationToken ct = default);
        Task<SettingsDto> GetSettings(CancellationToken ct = default);
    }
}
