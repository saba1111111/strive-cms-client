import React, { useEffect, useState, useRef } from "react";
import { useApi } from "../hooks/useApi";
import { format } from "date-fns";
import CampaignForm from "../components/CampaignForm";
import Modal from "../components/Modal";

interface Campaign {
  id: number;
  internalName: string;
  internalDescription: string;
  publicTitle: string;
  publicMessage: string;
  startAt: string;
  adminEmail: string;
  status: string;
}

const CampaignsPage: React.FC = () => {
  const { get } = useApi();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 40;
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [viewCampaign, setViewCampaign] = useState<Campaign | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);

  const loadPage = async (pageToLoad: number) => {
    setLoading(true);
    try {
      const res = await get<{
        campaigns: Campaign[];
        total: number;
        page: number;
        limit: number;
      }>(`/cms/campaigns?limit=${limit}&page=${pageToLoad}`);
      setCampaigns((prev) => {
        const newOnes = res.campaigns.filter(
          (c) => !prev.some((x) => x.id === c.id)
        );
        return [...prev, ...newOnes];
      });
      setTotal(res.total);
      setPage(res.page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

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
        campaigns.length < total
      ) {
        loadPage(page + 1);
      }
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [loading, page, total, campaigns.length]);

  const refreshList = () => {
    setCampaigns([]);
    loadPage(1);
  };

  return (
    <div
      style={{
        padding: "1rem",
        maxHeight: "800px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h1 style={{ fontSize: "1rem" }}>Campaigns: {total}</h1>
        <button
          onClick={() => {
            setFormOpen(true);
            setEditCampaign(null);
          }}
          style={{
            fontSize: "0.8rem",
            padding: "4px 8px",
            cursor: "pointer",
            marginRight: "8px",
          }}
        >
          Add New Campaign
        </button>
        <button
          onClick={refreshList}
          style={{ fontSize: "0.8rem", padding: "4px 8px", cursor: "pointer" }}
        >
          Refresh
        </button>
      </div>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.8rem",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "4px",
                  borderBottom: "1px solid #ccc",
                  textAlign: "start",
                }}
              >
                N
              </th>
              <th
                style={{
                  padding: "4px",
                  borderBottom: "1px solid #ccc",
                  textAlign: "start",
                }}
              >
                Public Title
              </th>
              <th
                style={{
                  padding: "4px",
                  borderBottom: "1px solid #ccc",
                  textAlign: "start",
                }}
              >
                Public Message
              </th>
              <th
                style={{
                  padding: "4px",
                  borderBottom: "1px solid #ccc",
                  textAlign: "start",
                }}
              >
                Start At
              </th>
              <th
                style={{
                  padding: "4px",
                  borderBottom: "1px solid #ccc",
                  textAlign: "start",
                }}
              >
                Admin Email
              </th>
              <th
                style={{
                  padding: "4px",
                  borderBottom: "1px solid #ccc",
                  textAlign: "start",
                }}
              >
                Status
              </th>
              <th
                style={{ padding: "4px", borderBottom: "1px solid #ccc" ,  textAlign: "start",}}
              ></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, index) => (
              <tr key={c.id}>
                <td style={{ padding: "4px", borderBottom: "1px solid #eee" }}>
                  {index + 1})
                </td>
                <td style={{ padding: "4px", borderBottom: "1px solid #eee" }}>
                  {c.publicTitle}
                </td>
                <td style={{ padding: "4px", borderBottom: "1px solid #eee" }}>
                  {c.publicMessage}
                </td>
                <td style={{ padding: "4px", borderBottom: "1px solid #eee" }}>
                  {format(new Date(c.startAt), "MMM d, yyyy, h:mm a")}
                </td>
                <td style={{ padding: "4px", borderBottom: "1px solid #eee" }}>
                  {c.adminEmail}
                </td>
                <td style={{ padding: "4px", borderBottom: "1px solid #eee" }}>
                  {c.status}
                </td>
                <td style={{ padding: "4px", borderBottom: "1px solid #eee" }}>
                  <button
                    onClick={() => setViewCampaign(c)}
                    style={{
                      fontSize: "0.8rem",
                      padding: "2px 6px",
                      cursor: "pointer",
                      marginRight: "4px",
                    }}
                  >
                    View
                  </button>
                  {c.status === "NOT_STARTED" && (
                    <button
                      onClick={() => {
                        setEditCampaign(c);
                        setFormOpen(true);
                      }}
                      style={{
                        fontSize: "0.8rem",
                        padding: "2px 6px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  )}
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

      {viewCampaign && (
        <Modal
          isOpen
          title="Campaign Details"
          onClose={() => setViewCampaign(null)}
        >
          <div style={{ fontSize: "1.1rem" }}>
            <p>
              <strong>Internal Name:</strong> {viewCampaign.internalName}
            </p>
            <p>
              <strong>Internal Message:</strong>{" "}
              {viewCampaign.internalDescription}
            </p>
            <p>
              <strong>Public Title:</strong> {viewCampaign.publicTitle}
            </p>
            <p>
              <strong>Public Message:</strong> {viewCampaign.publicMessage}
            </p>
            <p>
              <strong>Start At:</strong>{" "}
              {format(new Date(viewCampaign.startAt), "MMM d, yyyy, h:mm a")}
            </p>
            <p>
              <strong>Admin Email:</strong> {viewCampaign.adminEmail}
            </p>
            <p>
              <strong>Status:</strong> {viewCampaign.status}
            </p>
          </div>
        </Modal>
      )}

      <CampaignForm
        isOpen={formOpen}
        initialData={
          editCampaign
            ? {
                internalName: editCampaign.internalName,
                internalDescription: editCampaign.internalDescription,
                publicTitle: editCampaign.publicTitle,
                publicMessage: editCampaign.publicMessage,
                startAt: editCampaign.startAt,
                id: editCampaign.id,
              }
            : undefined
        }
        onClose={() => {
          setFormOpen(false);
          setEditCampaign(null);
        }}
        onSuccess={() => {
          refreshList();
          setEditCampaign(null);
        }}
      />
    </div>
  );
};

export default CampaignsPage;
