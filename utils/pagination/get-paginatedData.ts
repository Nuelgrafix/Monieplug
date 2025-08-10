const getPaginatedData = <T>(response: {
  data?: T[];
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
    links?: { url: string | null; label: string; active: boolean }[];
  };
}) => {
  const currentPage = response.meta?.current_page ?? 1;
  const totalPages = response.meta?.last_page ?? 1;
  const totalResults = response.meta?.total ?? 0;

  const prevLink = response.meta?.links?.find((link) => link.label === "&laquo; Previous")?.url;
  const nextLink = response.meta?.links?.find((link) => link.label === "Next &raquo;")?.url;

  return {
    currentPage,
    totalPages,
    numOfResults: totalResults,
    prevPage: currentPage > 1 ? currentPage - 1 : 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : totalPages,
    hasPreviousPage: !!prevLink,
    hasNextPage: !!nextLink,
    data: response.data ?? [],
  };
};

export default getPaginatedData;
