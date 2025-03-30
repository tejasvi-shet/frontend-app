import { useParams, useNavigate } from "react-router-dom";
import "./HospitalDoctorSelection.css";

// Sample doctors data for each hospital
const doctors = {
  1: [
    { id: 1, name: "Dr. Alice Brown", image: "https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D" },
    { id: 2, name: "Dr. John Smith", image: "https://plus.unsplash.com/premium_photo-1661630723145-eeb48f1bde8b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fHN1cmdlb258ZW58MHx8MHx8fDA%3D" },
    { id: 3, name: "Dr. Emily Davis", image: "https://plus.unsplash.com/premium_photo-1677410179106-95be01ec9301?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ1fHxkb2N0b3JzfGVufDB8fDB8fHww" }
  ],
  2: [
    { id: 4, name: "Dr. Sarah Lee", image: "https://plus.unsplash.com/premium_photo-1682089872205-dbbae3e4ba32?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODF8fHN1cmdlb258ZW58MHx8MHx8fDA%3D" },
    { id: 5, name: "Dr. David Kim", image: "https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D" },
    { id: 6, name: "Dr. Michael Harris", image: "https://plus.unsplash.com/premium_photo-1681967035389-84aabd80cb1e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D" }
  ],
  3: [
    { id: 7, name: "Dr. Emma White", image: "https://plus.unsplash.com/premium_photo-1661493878624-6da2ec67e9a3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTN8fG1hbGUlMjBkb2N0b3JzfGVufDB8fDB8fHww" },
    { id: 8, name: "Dr. Olivia Green", image: "https://plus.unsplash.com/premium_photo-1661400612726-6ff3a7de426e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjM3fHxzdXJnZW9ufGVufDB8fDB8fHww" },
    { id: 9, name: "Dr. James Wilson", image: "https://plus.unsplash.com/premium_photo-1681967000776-9c58dcb6526e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTd8fG1hbGUlMjBkb2N0b3JzfGVufDB8fDB8fHww" }
  ]
};

function DoctorSelection() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();

  if (!hospitalId || !doctors[hospitalId]) {
    return <h2 className="error">Invalid Hospital Selection</h2>;
  }

  return (
    <div className="hospital-doctor-container">
      <div className="container">
        <h2 className="title">Select a Doctor</h2>
        <div className="grid">
          {doctors[hospitalId].map((doctor) => (
            <div key={doctor.id} className="card" onClick={() => navigate(`/canvas/${doctor.id}`)}>
              <img src={doctor.image} alt={doctor.name} className="card-img" />
              <h3 className="card-title">{doctor.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorSelection;