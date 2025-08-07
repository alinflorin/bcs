using Bcs.Api.Dto;

namespace Bcs.Api.Services.Interfaces
{
    public interface IHealthService
    {
        Task<HealthcheckResponseDto> CheckHealth(CancellationToken ct = default);
    }
}
