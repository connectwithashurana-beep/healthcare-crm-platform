import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./Interactions.css";

function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [formData, setFormData] = useState({
    hcpName: "",
    interactionType: "",
    date: "",
    time: "",
    brandDiscussed: "",
    topicsDiscussed: "",
  });

  // Load saved interactions
  useEffect(() => {
    const savedInteractions = localStorage.getItem("crm_interactions");

    if (savedInteractions) {
      setInteractions(JSON.parse(savedInteractions));
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save interaction
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.hcpName ||
      !formData.interactionType ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newInteraction = {
      id: Date.now(),
      ...formData,
      status: "Completed",
    };

    const updatedInteractions = [newInteraction, ...interactions];

    setInteractions(updatedInteractions);

    localStorage.setItem(
      "crm_interactions",
      JSON.stringify(updatedInteractions)
    );

    setFormData({
      hcpName: "",
      interactionType: "",
      date: "",
      time: "",
      brandDiscussed: "",
      topicsDiscussed: "",
    });

    alert("Interaction saved successfully!");
  };

  // Delete interaction
  const handleDelete = (id) => {
    const updatedInteractions = interactions.filter(
      (interaction) => interaction.id !== id
    );

    setInteractions(updatedInteractions);

    localStorage.setItem(
      "crm_interactions",
      JSON.stringify(updatedInteractions)
    );
  };

  return (
    <Layout>
      <h1>HCP Interaction</h1>

      {/* Interaction Form */}
      <form className="interaction-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="hcpName"
          placeholder="HCP Name"
          value={formData.hcpName}
          onChange={handleChange}
        />

        <select
          name="interactionType"
          value={formData.interactionType}
          onChange={handleChange}
        >
          <option value="">Interaction Type</option>
          <option value="In Person">In Person</option>
          <option value="Phone Call">Phone Call</option>
          <option value="Video Call">Video Call</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />

        <input
          type="text"
          name="brandDiscussed"
          placeholder="Brand Discussed"
          value={formData.brandDiscussed}
          onChange={handleChange}
        />

        <textarea
          name="topicsDiscussed"
          placeholder="Topics Discussed"
          rows="4"
          value={formData.topicsDiscussed}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Save Interaction</button>
      </form>

      {/* Saved Interactions */}
      <div className="interactions-section">
        <h2>Recent Interactions</h2>

        {interactions.length === 0 ? (
          <p>No interactions recorded yet.</p>
        ) : (
          <div className="interaction-list">
            {interactions.map((interaction) => (
              <div className="interaction-card" key={interaction.id}>
                <div>
                  <h3>{interaction.hcpName}</h3>

                  <p>
                    <strong>Type:</strong>{" "}
                    {interaction.interactionType}
                  </p>

                  <p>
                    <strong>Date:</strong> {interaction.date}
                  </p>

                  <p>
                    <strong>Time:</strong> {interaction.time}
                  </p>

                  <p>
                    <strong>Brand:</strong>{" "}
                    {interaction.brandDiscussed || "-"}
                  </p>

                  <p>
                    <strong>Topics:</strong>{" "}
                    {interaction.topicsDiscussed || "-"}
                  </p>

                  <p>
                    <strong>Status:</strong> {interaction.status}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(interaction.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Interactions;