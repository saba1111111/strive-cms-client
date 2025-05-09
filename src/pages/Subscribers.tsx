import React, { useEffect, useState, useRef } from "react";
import { useApi } from "../hooks/useApi";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: Date;
}

interface SubscribersResponse {
  total: number;
  page: number;
  limit: number;
  subscribers: Subscriber[];
}

const SubscribersPage: React.FC = () => {
  const { get } = useApi();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 40;
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadPage = async (pageToLoad: number) => {
    setLoading(true);
    try {
      const res = await get<SubscribersResponse>(
        `/cms/subscribers?limit=${limit}&page=${pageToLoad}`
      );

      setSubscribers((prev) => {
        const newOnes = res.subscribers.filter(
          (s) => !prev.some((existing) => existing.id === s.id)
        );
        return [...prev, ...newOnes];
      });
      setTotal(res.total);
      setPage(res.page);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    loadPage(1);
  }, []);

  // infinite scroll on the table container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      if (
        container.scrollTop > 0 &&
        nearBottom &&
        !loading &&
        subscribers.length < total
      ) {
        loadPage(page + 1);
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [loading, page, total, subscribers.length]);

  return (
    <div
      style={{
        padding: "2rem",
        maxHeight: "900px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
        Subscribers: {total}
      </h1>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
          maxWidth: "400px",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            fontSize: "0.8rem",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                N
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                Email
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                subscribed At
              </th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub, index) => (
              <tr key={sub.id}>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {index + 1})
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {sub.email}
                </td>
                <td
                  style={{
                    padding: "8px",
                    paddingRight: "16px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {new Date(sub.subscribedAt).toLocaleString("default", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <p
          style={{
            textAlign: "center",
            marginTop: "0.5rem",
            fontSize: "0.8rem",
          }}
        >
          Loading…
        </p>
      )}
    </div>
  );
};

export default SubscribersPage;
