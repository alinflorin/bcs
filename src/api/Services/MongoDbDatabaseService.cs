using Bcs.Api.Services.Interfaces;
using MongoDB.Driver;
using System.Linq.Expressions;

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

        public async Task<T> FindOne<T, TField>(string collectionName, Expression<Func<T, TField>> expr, TField value, CancellationToken ct = default)
        {
            var collection = _db.GetCollection<T>(collectionName);
            var filterDef = new FilterDefinitionBuilder<T>()
                .Eq(expr, value);
            return await (await collection.FindAsync(filterDef, null, ct)).FirstOrDefaultAsync(ct);
        }

        public async Task<bool> Healthcheck(CancellationToken ct = default)
        {
            var reply = await _db.Client.ListDatabaseNamesAsync(ct);
            return reply.Any(ct);
        }

        public async Task Upsert<T, TField>(string collectionName, Expression<Func<T, TField>> expr, TField value, T entity, CancellationToken ct = default)
        {
            var collection = _db.GetCollection<T>(collectionName);
            var filterDef = new FilterDefinitionBuilder<T>()
                .Eq(expr, value);
            await collection.ReplaceOneAsync(filterDef, entity, new ReplaceOptions { 
                IsUpsert = true
            }, ct);
        }
    }
}
