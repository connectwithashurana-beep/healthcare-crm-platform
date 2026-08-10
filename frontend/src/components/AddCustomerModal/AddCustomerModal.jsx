import { useState, useEffect } from "react";
import "./AddCustomerModal.css";

function AddCustomerModal({
  isOpen,
  closeModal,
  onSave,
  editingCustomer,
  isEditing,
  statusOptions,
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    country: "",
    status: statusOptions?.[0] || "Lead",
  });

  useEffect(() => {
    if (isEditing && editingCustomer) {
      setFormData({
        first_name: editingCustomer.first_name || "",
        last_name: editingCustomer.last_name || "",
        email: editingCustomer.email || "",
        phone: editingCustomer.phone || "",
        company: editingCustomer.company || "",
        city: editingCustomer.city || "",
        state: editingCustomer.state || "",
        country: editingCustomer.country || "",
        status: editingCustomer.status || statusOptions?.[0] || "Lead",
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        state: "",
        country: "",
        status: statusOptions?.[0] || "Lead",
      });
    }
  }, [editingCustomer, isEditing, isOpen, statusOptions]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const requiredFields = ["first_name", "last_name", "email", "phone", "company", "city"];
    const missingField = requiredFields.find((field) => !formData[field]?.trim());

    if (missingField) {
      alert("Please fill all required fields.");
      return;
    }

    await onSave(formData);
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isEditing ? "Edit Customer" : "Add Customer"}</h2>

        <div className="modal-row">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />

        <div className="modal-row">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="modal-row">
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
          />
          <select name="status" value={formData.status} onChange={handleChange}>
            {statusOptions?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSave}>
            {isEditing ? "Update" : "Save"}
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCustomerModal;
