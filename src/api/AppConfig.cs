namespace Bcs.Api
{
    public class AppConfig
    {
        public OidcConfig? Oidc { get; set; }
        public QdrantConfig? Qdrant { get; set; }
        public MongoDbConfig? MongoDb { get; set; }
        public GeminiConfig? Gemini { get; set; }
    }

    public class OidcConfig
    {
        public required string Authority { get; set; }
        public required string Audience { get; set; }
        public required string ClientId { get; set; }
    }

    public class QdrantConfig
    {
        public string Hostname { get; set; } = null!;
        public int Port { get; set; }
        public string? ApiKey { get; set; }
        public required string Distance { get; set; }
        public int Size { get; set; }
    }

    public class MongoDbConfig
    {
        public required string Hostname { get; set; }
        public int Port { get; set; }
        public required string Database { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
    }

    public class GeminiConfig
    {
        public required string ApiKey { get; set; }
        public required string EmbeddingModel { get; set; }
        public required string OpenAiUri { get; set; }
    }
}
