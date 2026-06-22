export const analyzeBug = async (payload) => {
  console.log("Sending Payload:", payload);

  const response = await fetch("http://localhost:5000/analyze-bug", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: payload.code,
      errorLog: payload.errorLog,
      language: payload.language,
    }),
  });

  const data = await response.json();
  return data;
};