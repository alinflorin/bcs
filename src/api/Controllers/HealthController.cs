using Bcs.Api.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Bcs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController(ILogger<HealthController> logger) : ControllerBase
{
    private readonly ILogger<HealthController> _logger = logger;

    [HttpGet]
    public async Task<HealthcheckResponseDto> Healthcheck()
    {
        _logger.LogInformation("Healthcheck called");
        await Task.CompletedTask;
        return new HealthcheckResponseDto
        {
            Healthy = true,
            Version = Version.Value
        };
    }
}
