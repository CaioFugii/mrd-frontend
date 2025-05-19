import Pagination from "react-bootstrap/Pagination";

interface Props {
  total: number;
  limit: number;
  page: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPage: (...props: any) => void;
}

export default function PaginationComponent({
  total,
  limit,
  page,
  setPage,
}: Props) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, page + half);

  if (end - start + 1 < maxVisible) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxVisible - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  // Botão anterior
  pages.push(
    <Pagination.Prev
      key="prev"
      onClick={() => setPage((p: number) => p - 1)}
      disabled={page === 1}
    />
  );

  // Primeira página + ellipsis
  if (start > 1) {
    pages.push(
      <Pagination.Item key={1} onClick={() => setPage(1)}>
        1
      </Pagination.Item>
    );
    if (start > 2)
      pages.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
  }

  // Números centrais
  for (let i = start; i <= end; i++) {
    pages.push(
      <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
        {i}
      </Pagination.Item>
    );
  }

  // Última página + ellipsis
  if (end < totalPages) {
    if (end < totalPages - 1)
      pages.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    pages.push(
      <Pagination.Item key={totalPages} onClick={() => setPage(totalPages)}>
        {totalPages}
      </Pagination.Item>
    );
  }

  // Botão próximo
  pages.push(
    <Pagination.Next
      key="next"
      onClick={() => setPage((p: number) => p + 1)}
      disabled={page === totalPages}
    />
  );

  return (
    <Pagination className="justify-content-center mt-4">{pages}</Pagination>
  );
}
