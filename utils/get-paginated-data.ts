const getPaginatedData = <T>(data: {
  current_page: number;
  last_page: number;
  total: number;
  prev_page_url: string;
  next_page_url: string;
  data: T[];
}) => {
  return {
    currentPage: data.current_page,
    totalPages: data.last_page,
    numOfResults: data.total,
    prevPage: Number(data.current_page) - 1 || 1,
    nextPage:
      data.current_page + 1 > data.last_page
        ? data.last_page
        : data.current_page + 1,
    hasPreviousPage: !!data.prev_page_url,
    hasNextPage: !!data.next_page_url,
    data: data.data as Array<T>,
  };
};

export default getPaginatedData;


