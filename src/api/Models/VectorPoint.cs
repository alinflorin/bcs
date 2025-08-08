namespace Bcs.Api.Models
{
    public class VectorPoint
    {
        public required int Id { get; set; }
        public required float[] Vectors { get; set; }
        public required string FileName { get; set; }
        public required int ChunkIndex { get; set; }
        public required int BatchIndex { get; set; }
        public required string Text { get; set; }
    }
}
