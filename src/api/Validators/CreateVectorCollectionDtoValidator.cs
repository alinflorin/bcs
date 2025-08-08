using Bcs.Api.Dto;
using Bcs.Api.Services.Interfaces;
using FluentValidation;

namespace Bcs.Api.Validators
{
    public class CreateVectorCollectionDtoValidator : AbstractValidator<CreateVectorCollectionDto>
    {
        public CreateVectorCollectionDtoValidator(IVectorStoreService vectorStoreService)
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("api.validation.required")
                .MustAsync(async (x, y, z, w) => {
                    var result = await vectorStoreService.CollectionExists(y, w);
                    return !result;
                })
                .WithMessage("api.validation.alreadyExists");
        }
    }
}
