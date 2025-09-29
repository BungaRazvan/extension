// const url = "https://backbone.razvan.app";
const url = "http://localhost:8000";

export function fetchFromBackground(endpoint, method = "get", params = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "fetch",
        endpoint,
        method,
        params,
      },
      (response) => {
        if (!response) {
          reject(new Error("No response from background script"));
          return;
        }

        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || "Unknown error"));
        }
      }
    );
  });
}

export default api = async (path, params = {}, method = "get") => {
  const httpMethod = method.toUpperCase();
  const queryString =
    httpMethod === "GET" && Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";

  const fetchOptions = {
    method: httpMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: httpMethod === "POST" ? JSON.stringify(params) : undefined,
  };
  const res = await fetch(`${url}/${path}${queryString}`, fetchOptions);

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  try {
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
};
