namespace Bcs.Api.Dto
{
    public class HealthcheckResponseDto
    {
        public bool Healthy { get; set; }
        public string Version { get; set; }
    }
}