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

export default api = async (
  path,
  params = {},
  method = "get",
  headers = {}
) => {
  const httpMethod = method.toUpperCase();
  const queryString =
    httpMethod === "GET" && Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";

  const fetchOptions = {
    method: httpMethod,
    headers: {},
    body: httpMethod === "POST" ? JSON.stringify(params) : undefined,
  };

  if (headers && Object.keys(headers).length) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      ...headers,
    };
  }
  const res = await fetch(`${BASE_URL}/${path}${queryString}`, fetchOptions);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    // parse JSON if response is JSON
    return await res.json();
  } else {
    // otherwise, return raw text (HTML or plain text)
    return await res.text();
  }
};
