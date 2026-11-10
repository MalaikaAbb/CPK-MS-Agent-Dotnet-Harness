const {
  threads,
  hasMoreThreads,
  isFetchingMoreThreads,
  fetchMoreThreads,
} = useThreads({
  agentId: "my-agent",
  limit: 20, // [!code highlight]
});

// In your JSX:
{hasMoreThreads && (
  <button
    onClick={fetchMoreThreads}
    disabled={isFetchingMoreThreads}
  >
    {isFetchingMoreThreads ? "Loading..." : "Load more"}
  </button>
)}
