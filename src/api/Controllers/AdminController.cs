using Bcs.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bcs.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireAdmin")]
    public class AdminController(IAdminService adminService) : ControllerBase
    {
        private readonly IAdminService _adminService = adminService;

        [HttpGet("collections")]
        public async Task<IActionResult> GetCollections()
        {
            return Ok(
                await _adminService.GetCollections(HttpContext.RequestAborted)
                );
        }
        
    }
}
