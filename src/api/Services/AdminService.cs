using Bcs.Api.Dto;
namespace Bcs.Api.Services
{
    public class AdminService(IVectorStoreService vectorStoreService) : IAdminService
    {
        private readonly IVectorStoreService _vectorStoreService = vectorStoreService;

        public async Task<IEnumerable<VectorCollectionDto>> GetCollections(CancellationToken ct = default)
        {
            return (await _vectorStoreService.GetCollections(ct))
                .Select(c => new VectorCollectionDto { Name = c })
                .ToList();

        }
    }
}
