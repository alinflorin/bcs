using Bcs.Api.Dto;
using FluentValidation;

namespace Bcs.Api.Validators
{
    public class SettingsDtoValidator : AbstractValidator<SettingsDto>
    {
        public SettingsDtoValidator()
        {
            RuleFor(x => x.SystemPrompt)
                .NotEmpty()
                .WithMessage("api.validation.required");
        }
    }
}
