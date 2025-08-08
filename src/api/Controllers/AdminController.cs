using Bcs.Api.Dto;
using Bcs.Api.Services.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace Bcs.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireAdmin")]
    public class AdminController(IAdminService adminService, IValidator<CreateVectorCollectionDto> createVectorCollectionDtoValidator) : ControllerBase
    {
        private readonly IAdminService _adminService = adminService;
        private readonly IValidator<CreateVectorCollectionDto> _createVectorCollectionDtoValidator = createVectorCollectionDtoValidator;

        [HttpGet("collections")]
        public async Task<IActionResult> GetCollections()
        {
            return Ok(
                await _adminService.GetCollections(HttpContext.RequestAborted)
                );
        }

        [HttpPost("collections")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateCollection([FromForm] string createVectorCollectionDtoString, [FromForm] List<IFormFile> pdfFiles)
        {
            using var ms = new MemoryStream(Encoding.UTF8.GetBytes(createVectorCollectionDtoString));
            var dto = await JsonSerializer.DeserializeAsync<CreateVectorCollectionDto>(ms, cancellationToken: HttpContext.RequestAborted);
            if (dto == null)
            {
                return BadRequest(new Dictionary<string, string[]> {
                    {"", ["api.admin.createCollection.invalidRequest"] }
                });
            }
            var validationResult = await _createVectorCollectionDtoValidator.ValidateAsync(dto, HttpContext.RequestAborted);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.ToDictionary());
            }
            var files = new List<Models.File>();

            foreach (var pdfFile in pdfFiles)
            {
                files.Add(new Models.File
                {
                    Content = pdfFile.OpenReadStream(),
                    FileName = pdfFile.FileName
                });
            }

            var serviceResponse = await _adminService.CreateCollection(dto, files, HttpContext.RequestAborted);

            foreach (var file in files)
            {
                file.Content.Close();
            }

            return Ok(serviceResponse);
        }

    }
}
