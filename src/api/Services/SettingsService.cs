using AutoMapper;
using Bcs.Api.Dto;
using Bcs.Api.Models.Entities;
using Bcs.Api.Services.Interfaces;

namespace Bcs.Api.Services
{
    public class SettingsService(IDatabaseService dbService, IMapper mapper, AppConfig appConfig) : ISettingsService
    {
        private readonly IDatabaseService _dbService = dbService;
        private readonly IMapper _mapper = mapper;
        private readonly AppConfig _appConfig = appConfig;

        public async Task<SettingsDto> SaveSettings(SettingsDto dto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<SettingsEntity>(dto);
            await _dbService.Upsert("settings", x => x.Id, "settings", entity, ct);
            return _mapper.Map<SettingsDto>(entity);
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
            return _mapper.Map<SettingsDto>(entity);
        }
    }
}
