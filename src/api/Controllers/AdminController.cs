using Bcs.Api.Dto;
using Bcs.Api.Helpers;
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

        [HttpGet("vector-collections")]
        public async Task<IActionResult> GetVectorCollections()
        {
            return Ok(
                await _adminService.GetVectorCollections(HttpContext.RequestAborted)
                );
        }

        [HttpPost("vector-collections")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateVectorCollection([FromForm] CreateVectorCollectionFormModel model)
        {
            using var ms = new MemoryStream(Encoding.UTF8.GetBytes(model.CreateVectorCollectionDtoString));
            var dto = await JsonSerializer.DeserializeAsync<CreateVectorCollectionDto>(ms, JsonHelper.GetOptions(), cancellationToken: HttpContext.RequestAborted);
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

            foreach (var pdfFile in model.PdfFiles)
            {
                files.Add(new Models.File
                {
                    Content = pdfFile.OpenReadStream(),
                    FileName = pdfFile.FileName
                });
            }

            var serviceResponse = await _adminService.CreateVectorCollection(dto, files, HttpContext.RequestAborted);

            foreach (var file in files)
            {
                file.Content.Close();
            }

            return Ok(serviceResponse);
        }

        [HttpDelete("vector-collections/{collectionName}")]
        public async Task<IActionResult> DeleteVectorCollection([FromRoute] string collectionName)
        {
            return Ok(await _adminService.DeleteVectorCollection(collectionName, HttpContext.RequestAborted));
        }

    }
}
