import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useApi } from "../hooks/useApi";
import { formatISO } from "date-fns";

export interface CampaignInput {
  internalName: string;
  internalDescription: string;
  publicTitle: string;
  publicMessage: string;
  startAt: string;
}

interface CampaignFormProps {
  isOpen: boolean;
  initialData?: CampaignInput & { id: number };
  onClose: () => void;
  onSuccess: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}) => {
  const { post, patch } = useApi();
  //   const { success, error } = useToast();
  const [form, setForm] = useState<CampaignInput>({
    internalName: "",
    internalDescription: "",
    publicTitle: "",
    publicMessage: "",
    startAt: formatISO(new Date()),
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        internalName: "",
        internalDescription: "",
        publicTitle: "",
        publicMessage: "",
        startAt: formatISO(new Date()),
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const val = name === "startAt" ? new Date(value).toISOString() : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(initialData);
    if (initialData && (initialData as any).id) {
      await patch(`/cms/campaigns/${(initialData as any).id}`, form);
    } else {
      await post("/cms/campaigns", form);
    }
    onClose();
    onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={initialData ? "Edit Campaign" : "Add New Campaign"}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          fontSize: "0.8rem",
        }}
      >
        <span>Internal Name</span>
        <input
          name="internalName"
          value={form.internalName}
          onChange={handleChange}
          placeholder="Internal Name"
          required
          style={{ padding: "4px" }}
        />
        <span>Internal Description</span>
        <textarea
          name="internalDescription"
          value={form.internalDescription}
          onChange={handleChange}
          placeholder="Internal Description"
          required
          style={{ padding: "4px", minWidth: "500px", minHeight: "100px" }}
        />
        <span>Public Title</span>
        <input
          name="publicTitle"
          value={form.publicTitle}
          onChange={handleChange}
          placeholder="Public Title"
          required
          style={{ padding: "4px" }}
        />

        <span>Public Message</span>
        <textarea
          name="publicMessage"
          value={form.publicMessage}
          onChange={handleChange}
          placeholder="Public Message"
          required
          style={{ padding: "4px", minWidth: "500px", minHeight: "100px" }}
        />

        <span>Start At</span>
        <input
          type="datetime-local"
          name="startAt"
          value={form.startAt.slice(0, 16)}
          onChange={handleChange}
          required
          style={{ padding: "4px" }}
        />
        <button type="submit" style={{ padding: "6px", cursor: "pointer" }}>
          {initialData ? "Save Changes" : "Create Campaign"}
        </button>
      </form>
    </Modal>
  );
};

export default CampaignForm;
