import React from "react";

const AboutUs = () => {
  const outerContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D5A6E7", // Light outer background
    minHeight: "100vh",
    padding: "300px",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B47DD1", // Inner card background
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    maxWidth: "900px",
    margin: "50px auto",
    fontFamily: "'Arial', sans-serif",
    gap: "30px",
  };

  const imageStyle = {
    width: "500px",
    height: "auto",
    borderRadius: "12px",
    objectFit: "cover",
  };

  const textContainerStyle = {
    flex: 1,
    textAlign: "left",
    color: "white",
  };

  const headingStyle = {
    fontFamily: "'Comic Sans MS', cursive",
    color: "white",  
    fontSize: "40px",
    marginBottom: "20px",
  };

  const paragraphStyle = {
    fontSize: "20px",
    lineHeight: "1.6",
  };

  return (
    <div style={outerContainerStyle}>
      <div style={containerStyle}>
        {/* Left Side - Image */}
        <img
          src="https://media.istockphoto.com/id/1489036243/vector/vector-illustration-of-cute-kids-painting-together.jpg?s=612x612&w=0&k=20&c=mNTYddObKWkuiqGEjzQ3cV0zHHVOtMizqQxG4JLQasQ="
          alt="Creative Kids"
          style={imageStyle}
        />

        {/* Right Side - Text */}
        <div style={textContainerStyle}>
          <h1 >
            <center><b>About Us</b></center>
          </h1>
          <p style={paragraphStyle}>
            "Canvas of Care is a safe and fun platform where young artists aged 5-15 can create, share, and explore amazing artwork. Our mission is to inspire creativity and provide a supportive community for budding artists. Whether you're here to showcase your work, learn new techniques, or connect with fellow artists, Canvas of Care is the perfect space for you!"

          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
