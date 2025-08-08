using AutoMapper;
using Bcs.Api.Dto;
using Bcs.Api.Models.Entities;

namespace Bcs.Api.Mappers
{
    public class SettingsMapper : Profile
    {
        public SettingsMapper()
        {
            CreateMap<SettingsEntity, SettingsDto>()
                .PreserveReferences()
                .ReverseMap()
                .PreserveReferences();
        }
    }
}
