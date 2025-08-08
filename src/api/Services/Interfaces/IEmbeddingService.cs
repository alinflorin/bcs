namespace Bcs.Api.Services.Interfaces
{
    public interface IEmbeddingService
    {
        Task<float[]> GetEmbedding(string content, CancellationToken ct = default);
    }
}
