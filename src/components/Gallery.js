import { useEffect, useState } from "react";
import axios from "axios";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/gallery");
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setGallery(response.data);
        } else if (response.data && Array.isArray(response.data.images)) {
          setGallery(response.data.images);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await axios.post("http://localhost:5000/api/upload", formData);
      alert("Image uploaded successfully!");
      setSelectedFile(null);
      setPreview(null);
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/gallery");
      setGallery(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3>Gallery</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="file" onChange={handleFileChange} />
          {preview && <img src={preview} alt="Preview" style={{ width: "50px", height: "50px", borderRadius: "5px" }} />}
          <button onClick={handleUpload} disabled={!selectedFile}>Upload</button>
        </div>
      </div>
      {loading ? (
        <p>Loading images...</p>
      ) : error ? (
        <p>{error}</p>
      ) : gallery.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
          {gallery.map((image, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img src={image.imageUrl || image.url} alt={`Drawing ${index + 1}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }} />
            </div>
          ))}
        </div>
      ) : (
        <p>No images found</p>
      )}
    </div>
  );
};

export default Gallery;
