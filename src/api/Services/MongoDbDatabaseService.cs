using MongoDB.Driver;

namespace Bcs.Api.Services
{
    public class MongoDbDatabaseService : IDatabaseService
    {
        private readonly IMongoDatabase _db;

        public MongoDbDatabaseService(AppConfig config)
        {
            var settings = new MongoClientSettings
            {
                Server = new MongoServerAddress(config.MongoDb!.Hostname, config.MongoDb!.Port),
            };
            if (config.MongoDb!.Username?.Length > 0)
            {
                settings.Credential = MongoCredential.CreateCredential(config.MongoDb!.Database, config.MongoDb!.Username, config.MongoDb!.Password);
            }
            var client = new MongoClient(settings);
            _db = client.GetDatabase(config.MongoDb!.Database);
        }

        public async Task<bool> Healthcheck(CancellationToken ct = default)
        {
            var reply = await _db.Client.ListDatabaseNamesAsync(ct);
            return reply.Any(ct);
        }
    }
}
