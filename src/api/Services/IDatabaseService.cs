namespace Bcs.Api.Services
{
    public interface IDatabaseService
    {
        Task<bool> Healthcheck(CancellationToken ct = default);
    }
}
