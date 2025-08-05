using Bcs.Api.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qdrant.Client;

namespace Bcs.Api.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class HealthController(QdrantClient qdrantClient) : ControllerBase
{
    private readonly QdrantClient _qdrantClient = qdrantClient;

    [HttpGet]
    public async Task<IActionResult> Healthcheck()
    {
        var qdrantReply = await _qdrantClient.HealthAsync(this.ControllerContext.HttpContext.RequestAborted);
        if (qdrantReply.Version == null || qdrantReply.Version.Length == 0)
        {
            return StatusCode(500, new HealthcheckResponseDto { 
                Healthy = false,
                Version = Version.Value,
                Reason = "Qdrant database is down"
            });
        }
        return Ok(new HealthcheckResponseDto
        {
            Healthy = true,
            Version = Version.Value
        });
    }
}
