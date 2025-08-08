namespace Bcs.Api.Helpers
{
    public static class StringHelper
    {
        public static IEnumerable<string> ChunkText(string text, int chunkSize, int overlap)
        {
            if (string.IsNullOrEmpty(text))
                yield break;

            for (int i = 0; i < text.Length; i += chunkSize - overlap)
            {
                var length = Math.Min(chunkSize, text.Length - i);
                yield return text.Substring(i, length);

                if (i + length >= text.Length)
                    break;
            }
        }
    }
}
