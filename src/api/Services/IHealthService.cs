using Bcs.Api.Dto;

namespace Bcs.Api.Services
{
    public interface IHealthService
    {
        Task<HealthcheckResponseDto> CheckHealth(CancellationToken ct = default);
    }
}
