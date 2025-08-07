namespace Bcs.Api.Services.Interfaces
{
    public interface IDatabaseService
    {
        Task<bool> Healthcheck(CancellationToken ct = default);
    }
}
