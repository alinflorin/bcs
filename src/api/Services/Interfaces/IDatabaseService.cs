using System.Linq.Expressions;

namespace Bcs.Api.Services.Interfaces
{
    public interface IDatabaseService
    {
        Task<bool> Healthcheck(CancellationToken ct = default);
        Task Upsert<T, TField>(string collectionName, Expression<Func<T, TField>> expr, TField value, T entity, CancellationToken ct = default);
        Task<T> FindOne<T, TField>(string collectionName, Expression<Func<T, TField>> expr, TField value, CancellationToken ct = default);
    }
}
