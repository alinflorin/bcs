using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Results;

namespace Bcs.Api.Validators
{
    public class AutoValidationCustomResultFactory : IFluentValidationAutoValidationResultFactory
    {
        public IActionResult CreateActionResult(ActionExecutingContext context, ValidationProblemDetails? validationProblemDetails)
        {
            return new BadRequestObjectResult(validationProblemDetails?.Errors.ToDictionary(x => x.Key.ToCamelCase(), x => x.Value));
        }
    }
}
