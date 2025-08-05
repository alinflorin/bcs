using Bcs.Api.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Qdrant.Client;

namespace Bcs.Api.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class HealthController(QdrantClient qdrantClient, IMongoDatabase db, ILogger<HealthController> logger) : ControllerBase
{
    private readonly ILogger<HealthController> _logger = logger;
    private readonly QdrantClient _qdrantClient = qdrantClient;
    private readonly IMongoDatabase _db = db;

    [HttpGet]
    public async Task<IActionResult> Healthcheck()
    {
        try
        {
            var qdrantReplyTask = _qdrantClient.HealthAsync(HttpContext.RequestAborted);
            var mongoReplyTask = _db.Client.ListDatabaseNamesAsync(HttpContext.RequestAborted);

            await Task.WhenAll(qdrantReplyTask, mongoReplyTask);
        } catch (Exception e)
        {
            _logger.LogError(e, "Healthcheck failed");
            return StatusCode(500, new HealthcheckResponseDto { 
                Reason = e.Message,
                Healthy = false,
                Version = Version.Value
            });
        }
        

        return Ok(new HealthcheckResponseDto
        {
            Healthy = true,
            Version = Version.Value
        });
    }
}
