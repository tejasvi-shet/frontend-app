import React from "react";

const ContactUs = () => {
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
    width: "400px",
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
          src="https://img.freepik.com/premium-photo/digital-drawing-tablet-designed-kids-with-creative-apps-features_1314467-164321.jpg"
          alt="Creative Kids"
          style={imageStyle}
        />

        {/* Right Side - Text */}
        <div style={textContainerStyle}>
          <h1>
            <center><b>Contact Us</b></center>
          </h1>
          <p style={paragraphStyle}>
            Have questions or need support? We'd love to hear from you! You can reach us at:
            <br /><br />
            📧 <strong>Email:</strong> support@canvasofcare.com<br />
            📞 <strong>Phone:</strong> +1 (123) 456-7890<br />
            
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
