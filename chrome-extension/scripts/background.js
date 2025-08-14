chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeText") {
    analyzeText(request.text)
      .then((result) => sendResponse({ result }))
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }
});

async function analyzeText(text) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("Please select some text to analyze");
    }

    const response = await fetch("http://localhost:8000/api/full-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.detail || "API request failed");
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Validate required fields
    const requiredFields = ["truthScore", "verdict", "confidence", "analysis"];
    const missingFields = requiredFields.filter((field) => {
      const value = data[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      console.error("Missing fields:", missingFields);
      console.error("Current result:", JSON.stringify(data, null, 2));
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate field types
    if (
      typeof data.truthScore !== "number" ||
      data.truthScore < 0 ||
      data.truthScore > 100
    ) {
      console.error("Invalid truthScore:", data.truthScore);
      throw new Error("Invalid truthScore value");
    }

    if (!["true", "false", "mixed", "unverifiable"].includes(data.verdict)) {
      console.error("Invalid verdict:", data.verdict);
      throw new Error("Invalid verdict value");
    }

    if (!["high", "medium", "low"].includes(data.confidence)) {
      console.error("Invalid confidence:", data.confidence);
      throw new Error("Invalid confidence value");
    }

    // Ensure optional fields exist
    if (!data.sources) data.sources = [];
    if (!data.context) data.context = "";

    return formatResponse(data);
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw new Error(error.message);
  }
}

function formatResponse(result) {
  // Default values for missing fields
  const defaultResult = {
    truthScore: 0,
    verdict: "unverifiable",
    confidence: "low",
    analysis: "Unable to analyze the text.",
    sources: [],
    context: "",
  };

  // Merge with defaults to handle undefined values
  result = { ...defaultResult, ...result };

  const verdictEmoji = {
    true: "✅",
    false: "❌",
    mixed: "⚠️",
    unverifiable: "🔍",
  };

  const confidenceColor = {
    high: "#10b981",
    medium: "#f59e0b",
    low: "#ef4444",
  };

  const confidenceBgColor = {
    high: "rgba(16, 185, 129, 0.1)",
    medium: "rgba(245, 158, 11, 0.1)",
    low: "rgba(239, 68, 68, 0.1)",
  };

  return `
    <div class="truthmark-result">
      <div class="truthmark-header">
        <div class="truthmark-verdict">${
          verdictEmoji[result.verdict] || verdictEmoji.unverifiable
        }</div>
        <div>
          <h3 class="truthmark-title">Truth Analysis</h3>
          <div class="truthmark-confidence" style="color: ${
            confidenceColor[result.confidence]
          }; background: ${confidenceBgColor[result.confidence]}">
            ${
              result.confidence.charAt(0).toUpperCase() +
              result.confidence.slice(1)
            } Confidence
          </div>
        </div>
      </div>
      
      <div class="truthmark-score">
        <div class="truthmark-score-bar">
          <div class="truthmark-progress">
            <div class="truthmark-progress-fill" style="width: ${
              result.truthScore
            }%"></div>
          </div>
          <div class="truthmark-score-value">${result.truthScore}%</div>
        </div>
      </div>
      
      <div class="truthmark-analysis">
        <p>${result.analysis}</p>
      </div>
      
      ${
        result.sources && result.sources.length > 0
          ? `
        <div class="truthmark-sources">
          <h4>Sources</h4>
          <ul>
            ${result.sources.map((source) => `<li>${source}</li>`).join("")}
          </ul>
        </div>
      `
          : ""
      }
      
      ${
        result.context
          ? `
        <div class="truthmark-context">
          <p>${result.context}</p>
        </div>
      `
          : ""
      }
    </div>
  `;
}
