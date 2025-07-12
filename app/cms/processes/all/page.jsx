"use client";

import { sendToast } from "@/lib/helper";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProcessPage() {
  const [process, setProcess] = useState({
    sectionHeader: { mainTitle: "", subheading: "" },
    steps: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch process on mount
  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const res = await axios.get("/api/process");
        const data = await res.data;
        console.log(data);
        setProcess(data);
      } catch (err) {
        console.error("Failed to fetch process:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcess();
  }, []);

  const handleChange = (field, value) => {
    setProcess((prev) => ({
      ...prev,
      sectionHeader: { ...prev.sectionHeader, [field]: value },
    }));
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...process.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };

    setProcess((prev) => ({
      ...prev,
      steps: newSteps,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.patch("/api/process", { ...process });
      const data = await res.data;
      if (res.status === 200) {
        sendToast({
          title: "Updated",
          desc: "Service updated successfully",
        });
      }
    } catch (err) {
      console.error(err);
      sendToast({
        variant: "destructive",
        title: "Update failed",
        desc: err?.response?.data?.error || "Could not update service.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Process</h1>

      {/* Section Header */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          value={process?.sectionHeader?.mainTitle}
          onChange={(e) => handleChange("mainTitle", e.target.value)}
          placeholder="Main Title"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={process?.sectionHeader?.subheading}
          onChange={(e) => handleChange("subheading", e.target.value)}
          placeholder="Subheading"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {process?.steps?.map((step, idx) => (
          <div key={idx} className="p-4 border rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Step {idx + 1}</h3>
            <input
              type="text"
              value={step.title}
              onChange={(e) => handleStepChange(idx, "title", e.target.value)}
              placeholder="Step Title"
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              value={step.description}
              onChange={(e) =>
                handleStepChange(idx, "description", e.target.value)
              }
              placeholder="Step Description"
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
