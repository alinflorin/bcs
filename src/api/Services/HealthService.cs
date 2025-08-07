using Bcs.Api.Dto;
using MongoDB.Driver;
using Qdrant.Client;

namespace Bcs.Api.Services
{
    public class HealthService(IVectorStoreService vectorStoreService, IDatabaseService dbService) : IHealthService
    {
        private readonly IVectorStoreService _vectorStoreService = vectorStoreService;
        private readonly IDatabaseService _dbService = dbService;


        public async Task<HealthcheckResponseDto> CheckHealth(CancellationToken ct = default)
        {
            try
            {
                var qdrantReplyTask = _vectorStoreService.Healthcheck(ct);
                var mongoReplyTask = _dbService.Healthcheck(ct);

                await Task.WhenAll(qdrantReplyTask, mongoReplyTask);

                return new HealthcheckResponseDto
                {
                    Healthy = qdrantReplyTask.Result == true && qdrantReplyTask.Result == true,
                    Version = Version.Value
                };
            } catch (Exception e)
            {
                return new HealthcheckResponseDto
                {
                    Reason = e.Message,
                    Healthy = false,
                    Version = Version.Value
                };
            }
        }
    }
}
