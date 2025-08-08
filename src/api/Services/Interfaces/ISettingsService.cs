using Bcs.Api.Dto;

namespace Bcs.Api.Services.Interfaces
{
    public interface ISettingsService
    {
        Task<SettingsDto> SaveSettings(SettingsDto dto, CancellationToken ct = default);
        Task<SettingsDto> GetSettings(CancellationToken ct = default);
    }
}
