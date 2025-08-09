using Bcs.Api.Dto;
using Bcs.Api.Models.Entities;
using Bcs.Api.Services.Interfaces;

namespace Bcs.Api.Services
{
    public class SettingsService(IDatabaseService dbService, AppConfig appConfig) : ISettingsService
    {
        private readonly IDatabaseService _dbService = dbService;
        private readonly AppConfig _appConfig = appConfig;

        public async Task<SettingsDto> SaveSettings(SettingsDto dto, CancellationToken ct = default)
        {
            var entity = new SettingsEntity { 
                Id = "settings",
                SystemPrompt = dto.SystemPrompt!
            };
            await _dbService.Upsert("settings", x => x.Id, "settings", entity, ct);
            return new SettingsDto {
                SystemPrompt = dto.SystemPrompt
            };
        }

        public async Task<SettingsDto> GetSettings(CancellationToken ct = default)
        {
            var entity = await _dbService.FindOne<SettingsEntity, string>("settings", x => x.Id, "settings", ct);
            if (entity == null)
            {
                entity = new SettingsEntity
                {
                    Id = "settings",
                    SystemPrompt = _appConfig.DefaultSettings!.SystemPrompt
                };
            }
            return new SettingsDto { 
                SystemPrompt = entity.SystemPrompt
            };
        }
    }
}
