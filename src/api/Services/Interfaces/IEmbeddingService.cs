namespace Bcs.Api.Services.Interfaces
{
    public interface IEmbeddingService
    {
        Task<IEnumerable<float[]>> GetEmbeddings(IEnumerable<string> content, CancellationToken ct = default);
    }
}
