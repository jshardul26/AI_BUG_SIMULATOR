export const analyzeBug = async (payload) => {
  console.log("Sending Payload:", payload);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        rootCause:
          "Simulated backend response",
        confidence: "94%",
        severity: "High",
      });
    }, 2000);
  });
};