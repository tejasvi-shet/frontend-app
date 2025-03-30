import React, { useState } from "react";
import "./Fundraiser.css";

const Fundraiser = () => {
  const [donors, setDonors] = useState([
    { name: "Alice Johnson", hospital: "City Hospital", amount: "$500" },
    { name: "Bob Smith", hospital: "Green Valley Medical", amount: "$250" },
    { name: "Charlie Lee", hospital: "City Hospital", amount: "$1000" }
  ]);

  const [newDonor, setNewDonor] = useState({ name: "", hospital: "", amount: "" });

  const handleChange = (e) => {
    setNewDonor({ ...newDonor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDonor.name && newDonor.hospital && newDonor.amount) {
      setDonors([...donors, newDonor]);
      setNewDonor({ name: "", hospital: "", amount: "" });
    }
  };

  return (
    <div className="fundraiser-container">
      <h1 className="fundraiser-title">Fundraiser Donations</h1>
      <p className="fundraiser-subtitle">Thank you to our generous donors for supporting young artists!</p>

      {/* Form to add new donors */}
      <form className="donor-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newDonor.name}
          onChange={handleChange}
          placeholder="Donor Name"
          required
        />
        <input
          type="text"
          name="hospital"
          value={newDonor.hospital}
          onChange={handleChange}
          placeholder="Hospital Name"
          required
        />
        <input
          type="text"
          name="amount"
          value={newDonor.amount}
          onChange={handleChange}
          placeholder="Donation Amount"
          required
        />
        <button type="submit">Add Donor</button>
      </form>

      {/* Display Donor Cards */}
      <div className="donation-cards">
        {donors.map((donor, index) => (
          <div key={index} className="donation-card">
            <h3>{donor.name}</h3>
            <p><strong>Hospital:</strong> {donor.hospital}</p>
            <p><strong>Amount Donated:</strong> {donor.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fundraiser;