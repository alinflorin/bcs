namespace System.Collections.Generic
{
    public static class IEnumerableExtensions
    {
        public static IEnumerable<List<T>> Batch<T>(this IEnumerable<T> source, int size)
        {
            if (source == null) throw new ArgumentNullException(nameof(source));
            if (size <= 0) throw new ArgumentOutOfRangeException(nameof(size));

            using var e = source.GetEnumerator();
            while (e.MoveNext())
            {
                var bucket = new List<T>(size) { e.Current };
                while (bucket.Count < size && e.MoveNext())
                    bucket.Add(e.Current);

                yield return bucket;
            }
        }
    }
}
