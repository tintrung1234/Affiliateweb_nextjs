import SearchWrapperClient from "./ClientSearchWrapperPost";

export default function SearchResultsPostPage({
  params,
}: {
  params: { query: string };
}) {
  const query = decodeURIComponent(params.query);

  return (
    <SearchWrapperClient query={query} />
  );
}
