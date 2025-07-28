using Bcs.Api.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bcs.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet]
        public async Task<object> Test()
        {
            await Task.CompletedTask;
            return new
            {
                Test = 2
            };
        }

    }
}
