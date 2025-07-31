import SearchWrapperClient from "./ClientSearchWrapper";

export default function SearchResultsPage({
  params,
}: {
  params: { query: string };
}) {
  const query = decodeURIComponent(params.query);

  return (
    <SearchWrapperClient query={query} />
  );
}
