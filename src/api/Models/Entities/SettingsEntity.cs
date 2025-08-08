namespace Bcs.Api.Models.Entities
{
    public class SettingsEntity
    {
        public required string Id { get; set; } = "settings";
        public required string SystemPrompt { get; set; }
    }
}
