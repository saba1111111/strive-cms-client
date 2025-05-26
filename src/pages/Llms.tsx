import React, { useState, useEffect, useRef } from "react";
import { useApi } from "../hooks/useApi";
import { format } from "date-fns";

export enum LlmModels {
  deepseekChat = "deepseek-chat",
  gpt4Point1nano = "gpt-4.1-nano",
}

interface ModelResponse {
  id: number;
  adminId: number;
  prompt: string;
  response: string;
  model: string;
  createdAt: string;
  adminEmail: string;
}
const AskModelsPage: React.FC = () => {
  const { get, post } = useApi();
  const modelOptions = Object.values(LlmModels);

  const [prompt, setPrompt] = useState<string>("");
  const [selectedModels, setSelectedModels] = useState<LlmModels[]>(() => [
    ...modelOptions,
  ]);
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [askLoading, setAskLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadPage = async (pageToLoad: number) => {
    setLoading(true);
    try {
      const res = await get<{
        responses: ModelResponse[];
        total: number;
        page: number;
        limit: number;
      }>(`/cms/llm/models-responses?limit=${limit}&page=${pageToLoad}`);

      setResponses((prev) => {
        const newItems = res.responses.filter(
          (r) => !prev.some((x) => x.id === r.id)
        );
        return [...prev, ...newItems];
      });
      setTotal(res.total);
      setPage(res.page);
    } catch (error) {
      console.error("Error loading responses", error);
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
        responses.length < total
      ) {
        loadPage(page + 1);
      }
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [loading, page, total, responses.length]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || selectedModels.length === 0) return;

    setAskLoading(true);
    try {
      await post("/cms/llm/ask-models", { models: selectedModels, prompt });
      setResponses([]);
      loadPage(1);
      setPrompt("");
      setSelectedModels([...modelOptions]);
    } catch (error) {
      console.error("Error sending prompt", error);
    } finally {
      setAskLoading(false);
    }
  };

  const toggleModel = (model: LlmModels) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  return (
    <div
      style={{
        padding: "1rem",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <form onSubmit={handleAsk} style={{ marginBottom: "1rem" }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          rows={3}
          style={{ width: "100%", padding: "8px", fontSize: "0.9rem" }}
          required
        />
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            margin: "0.5rem 0",
          }}
        >
          {modelOptions.map((model) => (
            <label
              key={model}
              style={{ cursor: "pointer", fontSize: "0.9rem" }}
            >
              <input
                type="checkbox"
                checked={selectedModels.includes(model)}
                onChange={() => toggleModel(model)}
                style={{ marginRight: "4px" }}
              />
              {model}
            </label>
          ))}
        </div>
        <button
          type="submit"
          disabled={askLoading}
          style={{
            padding: "6px 12px",
            cursor: askLoading ? "not-allowed" : "pointer",
            opacity: askLoading ? 0.6 : 1,
          }}
        >
          {askLoading ? "Sending..." : "Send"}
        </button>
      </form>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        {responses.map((res) => (
          <div
            key={res.id}
            style={{
              marginBottom: "1rem",
              padding: "8px",
              borderBottom: "1px solid #eee",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "#555" }}>
              #{res.id} • Model: {res.model} • Admin: {res.adminEmail} (
              {res.adminId}) •{" "}
              {format(new Date(res.createdAt), "MMM d, yyyy HH:mm")}
            </div>
            <div style={{ marginTop: "4px", fontSize: "0.9rem" }}>
              <strong>Prompt:</strong> {res.prompt}
            </div>
            <div style={{ marginTop: "4px", fontSize: "0.9rem" }}>
              <strong>Response:</strong> {res.response}
            </div>
          </div>
        ))}
        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      </div>
    </div>
  );
};

export default AskModelsPage;
