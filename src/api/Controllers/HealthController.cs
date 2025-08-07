using Bcs.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bcs.Api.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class HealthController(IHealthService healthService) : ControllerBase
{
    private readonly IHealthService _healthService = healthService;

    [HttpGet]
    public async Task<IActionResult> Healthcheck()
    {
        return Ok(await _healthService.CheckHealth(HttpContext.RequestAborted));
    }
}
