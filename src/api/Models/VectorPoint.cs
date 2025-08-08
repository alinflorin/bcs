namespace Bcs.Api.Models
{
    public class VectorPoint
    {
        public required string Id { get; set; }
        public required float[] Vectors { get; set; }
        public required IDictionary<string, string> Payload { get; set; }
    }
}
