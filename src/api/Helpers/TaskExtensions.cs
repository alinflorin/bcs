namespace System.Threading.Tasks
{
    public static class TaskExtensions
    {
        public static async Task<List<T>> WhenAllLimited<T>(
            this IEnumerable<Func<Task<T>>> taskFactories,
            int maxDegreeOfParallelism,
            CancellationToken cancellationToken = default)
        {
            using var semaphore = new SemaphoreSlim(maxDegreeOfParallelism);
            var tasks = new List<Task<T>>();

            foreach (var factory in taskFactories)
            {
                await semaphore.WaitAsync(cancellationToken);
                tasks.Add(Task.Run(async () =>
                {
                    try
                    {
                        return await factory();
                    }
                    finally
                    {
                        semaphore.Release();
                    }
                }, cancellationToken));
            }

            return (await Task.WhenAll(tasks)).ToList();
        }
    }
}
