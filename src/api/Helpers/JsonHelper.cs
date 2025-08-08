using System.Text.Json;

namespace Bcs.Api.Helpers
{
    public static class JsonHelper
    {
        public static JsonSerializerOptions GetOptions()
        {
            return new JsonSerializerOptions {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
                UnmappedMemberHandling = System.Text.Json.Serialization.JsonUnmappedMemberHandling.Skip,
                ReadCommentHandling = JsonCommentHandling.Skip
            };
        }
    }
}
