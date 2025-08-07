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
                .MustAsync(vectorStoreService.CollectionExists)
                .WithMessage("api.validation.alreadyExists");
        }
    }
}
