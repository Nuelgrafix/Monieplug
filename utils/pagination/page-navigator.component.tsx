"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next13-progressbar";

import transactionStyles from "./page.module.scss";

interface IPageNavigatorProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  prevPage: number;
  currentPage: number;
  totalPages: number;
}

const PageNavigator = ({
  hasNextPage = false,
  hasPreviousPage = false,
  totalPages = 1,
  currentPage = 1,
  prevPage = 1,
  nextPage = 1,
}: Partial<IPageNavigatorProps>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={transactionStyles.pageNavigator}>
      <p>
        Showing Page <span>{currentPage}</span> of <span>{totalPages}</span>
      </p>
      <div className={transactionStyles.pageNavigatorButton}>
        <button
          className={transactionStyles.pageNavigatorBtn}
          disabled={!hasPreviousPage}
          onClick={() => changePage(prevPage)}
        >
          Previous
        </button>
        {/* <div className={transactionStyles.pageNavigatorcurrentPage}>
          <div className={transactionStyles.currentPage}>
            <p>{currentPage}</p>
          </div>
          ....
        </div> */}
        {/* Dynamic Page Numbers */}
        <div className={transactionStyles.pageNavigatorcurrentPage}>
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span
                key={i}
                className={transactionStyles.pageNavigatorButton}
                style={{ cursor: "default" }}
              >
                ...
              </span>
            ) : (
              <button
                key={i}
                className={
                  page === currentPage
                    ? `${transactionStyles.currentPage}`
                    : transactionStyles.pageNavigatorBtn
                }
                onClick={() => changePage(Number(page))}
              >
                <p>{page}</p>
              </button>
            )
          )}
        </div>

        <button
          className={transactionStyles.pageNavigatorBtn}
          disabled={!hasNextPage}
          onClick={() => changePage(nextPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PageNavigator;
