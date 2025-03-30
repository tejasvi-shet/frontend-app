import React from "react";

const PrivacyPolicy = () => {
  const outerContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D5A6E7", // Light outer background (change this to what you want)
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
          src="https://media.istockphoto.com/id/1026632588/photo/funny-child-girl-draws-laughing-shows-hands-dirty-with-paint.jpg?s=612x612&w=0&k=20&c=7JCNEfWqx9VfnkzQs-jFwbVpk_S7X5xT8mnVE8WK3R0="
          alt="Creative Kids"
          style={imageStyle}
        />

        {/* Right Side - Text */}
        <div style={textContainerStyle}>
          <h1>
            <center><b>Privacy Policy</b></center>
          </h1>
          <p style={paragraphStyle}>
            Welcome to <strong>Canvas of Care</strong>, a creative platform for children aged 5 to 15 battling cancer. At Canvas of Care, we value your privacy. We do not sell or share your personal information with third parties. Your data, including login credentials and artwork submissions, is securely stored and used only to improve your experience on our platform. By using our website, you agree to our data collection practices in accordance with applicable privacy laws.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
