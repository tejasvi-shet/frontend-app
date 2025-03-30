import { useNavigate } from "react-router-dom";
import "./HospitalDoctorSelection.css";

const hospitals = [
  { id: 1, name: "City Hospital", image: "https://media.istockphoto.com/id/1452316636/photo/paramedics-taking-patient-on-stretcher-from-ambulance-to-hospital.jpg?s=1024x1024&w=is&k=20&c=hiJRZkNtjfQDl4PeQp_wmBfIxzSQ-uEPVHWMNosJ2-Q=" },
  { id: 2, name: "Fortis Healthcare", image: "https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=1024x1024&w=is&k=20&c=PmaJ_oxBGdRw0c8g_-KAb2hZVzWEK5Yx83fe2plqLL4=" },
  { id: 3, name: "Apollo Hospital", image: "https://media.istockphoto.com/id/1139755582/photo/medical-equipment-on-the-background-of-group-of-health-workers-in-the-icu.jpg?s=1024x1024&w=is&k=20&c=7jrK90aF8uHKWkG1IP_VRB5KbkszzERurwqFCdc5dbQ=" }
];

function HospitalSelection() {
  const navigate = useNavigate();

  const handleCardClick = (hospitalId) => {
    navigate(`/doctors/${hospitalId}`); // Navigate to the doctors page with hospital ID
  };

  return (
    <div className="container">
      <h2 className="title">Select a Hospital</h2>
      <div className="grid">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="card"
            onClick={() => handleCardClick(hospital.id)} // Add click handler
          >
            <img src={hospital.image} alt={hospital.name} className="card-img" />
            <h3 className="card-title">{hospital.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HospitalSelection;