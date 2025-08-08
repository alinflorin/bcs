namespace Bcs.Api.Dto
{
    public class ExceptionDto
    {
        public int Status { get; set; }
        public string? Message { get; set; }
        public required string Title { get; set; }
        public string? StackTrace { get; set; }
    }
}
