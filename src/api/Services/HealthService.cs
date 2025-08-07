using Bcs.Api.Dto;
using MongoDB.Driver;
using Qdrant.Client;

namespace Bcs.Api.Services
{
    public class HealthService(IMongoDatabase db, QdrantClient qdrantClient) : IHealthService
    {
        private readonly IMongoDatabase _db = db;
        private readonly QdrantClient _qdrantClient = qdrantClient;

        public async Task<HealthcheckResponseDto> CheckHealth(CancellationToken ct = default)
        {
            try
            {
                var qdrantReplyTask = _qdrantClient.HealthAsync(ct);
                var mongoReplyTask = _db.Client.ListDatabaseNamesAsync(ct);

                await Task.WhenAll(qdrantReplyTask, mongoReplyTask);

                return new HealthcheckResponseDto
                {
                    Healthy = qdrantReplyTask.Result.Version != null && qdrantReplyTask.Result.Version.Length > 0 && mongoReplyTask.Result.Any(ct),
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
