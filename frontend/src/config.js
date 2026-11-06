export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function analyzeResume(file, jobDescription) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.json()
      .then((d) => d.detail)
      .catch(() => response.statusText);
    throw new Error(Array.isArray(detail) ? detail.map((d) => d.msg).join("; ") : detail);
  }

  return response.json();
}
