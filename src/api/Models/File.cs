namespace Bcs.Api.Models
{
    public class File
    {
        public required string FileName { get; set; }
        public required Stream Content { get; set; }
    }
}
