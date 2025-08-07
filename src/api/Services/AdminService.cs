using Bcs.Api.Dto;
using Bcs.Api.Services.Interfaces;

namespace Bcs.Api.Services
{
    public class AdminService(IVectorStoreService vectorStoreService) : IAdminService
    {
        private readonly IVectorStoreService _vectorStoreService = vectorStoreService;

        public async Task<VectorCollectionDto> CreateCollection(CreateVectorCollectionDto collection, Stream[] files, CancellationToken ct = default)
        {
            await Task.CompletedTask;
            return null;
        }

        public async Task<IEnumerable<VectorCollectionDto>> GetCollections(CancellationToken ct = default)
        {
            return (await _vectorStoreService.GetCollections(ct))
                .Select(c => new VectorCollectionDto { Name = c })
                .ToList();

        }
    }
}
