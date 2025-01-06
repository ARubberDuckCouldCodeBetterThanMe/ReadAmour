/**************************************************************
  1) DIMENSION SCORES
     We track "H", "Y", and "W". They can be positive or negative.
**************************************************************/
let dimensionScores = {
    H: 0, // "How" they read
    Y: 0, // "Why" they read
    W: 0  // "What" they read
  };
  
  /**************************************************************
    2) QUESTION CONFIGURATION
       "pos" => "Strongly Agree" adds +2, "Strongly Disagree" => -2.
       "neg" => "Strongly Agree" => -2, "Strongly Disagree" => +2.
  **************************************************************/
  const questionMap = {
    // HOW (H)
    H1:  { dimension: "H", sign: "pos" },
    H2:  { dimension: "H", sign: "neg" },
    H3:  { dimension: "H", sign: "neg" },
    H4:  { dimension: "H", sign: "pos" },
    H5:  { dimension: "H", sign: "neg" },
    H6:  { dimension: "H", sign: "pos" },
    H7:  { dimension: "H", sign: "pos" },
    H8:  { dimension: "H", sign: "pos" },
    H9:  { dimension: "H", sign: "neg" },
    H10: { dimension: "H", sign: "neg" },
    H11: { dimension: "H", sign: "pos" },
    H12: { dimension: "H", sign: "pos" },
    H13: { dimension: "H", sign: "neg" },
  
    // WHY (Y)
    Y1:  { dimension: "Y", sign: "neg" },
    Y2:  { dimension: "Y", sign: "pos" },
    Y3:  { dimension: "Y", sign: "neg" },
    Y4:  { dimension: "Y", sign: "pos" },
    Y5:  { dimension: "Y", sign: "neg" },
    Y6:  { dimension: "Y", sign: "pos" },
    Y7:  { dimension: "Y", sign: "neg" },
    Y8:  { dimension: "Y", sign: "pos" },
    Y9:  { dimension: "Y", sign: "neg" },
    Y10: { dimension: "Y", sign: "pos" },
    Y11: { dimension: "Y", sign: "neg" },
    Y12: { dimension: "Y", sign: "pos" },
    Y13: { dimension: "Y", sign: "neg" },
  
    // WHAT (W)
    W1:  { dimension: "W", sign: "neg" },
    W2:  { dimension: "W", sign: "pos" },
    W3:  { dimension: "W", sign: "pos" },
    W4:  { dimension: "W", sign: "pos" },
    W5:  { dimension: "W", sign: "neg" },
    W6:  { dimension: "W", sign: "neg" },
    W7:  { dimension: "W", sign: "pos" },
    W8:  { dimension: "W", sign: "neg" },
    W9:  { dimension: "W", sign: "neg" },
    W10: { dimension: "W", sign: "pos" },
    W11: { dimension: "W", sign: "neg" },
    W12: { dimension: "W", sign: "pos" },
    W13: { dimension: "W", sign: "neg" },
    W14: { dimension: "W", sign: "pos" }
  };
  
  /**************************************************************
    3) getScore(radioValue, sign)
       Convert a 1..5 radioValue => -2..+2, then flip if sign=neg.
  **************************************************************/
  function getScore(radioValue, sign) {
    // 1 => -2, 2 => -1, 3 => 0, 4 => +1, 5 => +2
    const baseScore = parseInt(radioValue, 10) - 3;
    return (sign === "neg") ? -baseScore : baseScore;
  }
  
  /**************************************************************
    4) calculateScores()
       Loops through all checked radio buttons, updates dimensionScores.
  **************************************************************/
  function calculateScores() {
    // Reset each time
    dimensionScores.H = 0;
    dimensionScores.Y = 0;
    dimensionScores.W = 0;
  
    const form = document.getElementById("reading-archetype-test");
    const checkedInputs = form.querySelectorAll("input[type='radio']:checked");
  
    checkedInputs.forEach((input) => {
      const qName = input.name;   // e.g., "H1", "Y5", ...
      const qValue = input.value; // "1".."5"
      const config = questionMap[qName];
      if (config) {
        const { dimension, sign } = config;
        const score = getScore(qValue, sign);
        dimensionScores[dimension] += score;
      }
    });
  }
  
  /**************************************************************
    5) getDimensionSign(score)
       If score > 0 => "+"
       If score < 0 => "-"
       If score === 0 => "tempZero"
  **************************************************************/
  function getDimensionSign(score) {
    if (score > 0) return "+";
    if (score < 0) return "-";
    return "tempZero"; // We'll convert it to + unless all three are zero.
  }
  
  /**************************************************************
    6) determineArchetype(hSign, ySign, wSign)
       - If all three = "tempZero" => The Specialist
       - Otherwise push tempZero => "+"
       - Then match final triple of + or - to an archetype.
  **************************************************************/
  function determineArchetype(hSign, ySign, wSign) {
    // If all three are 0 => The Specialist
    if (hSign === "tempZero" && ySign === "tempZero" && wSign === "tempZero") {
      return "The Specialist";
    }
  
    // If ANY dimension is "tempZero", push it to "+"
    if (hSign === "tempZero") hSign = "+";
    if (ySign === "tempZero") ySign = "+";
    if (wSign === "tempZero") wSign = "+";
  
    const combo = `${hSign}${ySign}${wSign}`; // e.g. "++-", "-+-", etc.
  
    // Here’s an example 8 archetypes:
    const archetypeMap = {
      "+++": "The Dreamer",
      "++-": "The Wanderer",
      "+-+": "The Romantic",
      "+--": "The Idealist",
      "-++": "The Detective",
      "-+-": "The Futurist",
      "--+": "The Philosopher",
      "---": "The Trailblazer"
    };
  
    // Return the matching archetype or fallback
    return archetypeMap[combo] || "Some Unique Hybrid";
  }
  
  /**************************************************************
    7) MAIN: On DOMContentLoaded, attach form submit handler.
  **************************************************************/
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reading-archetype-test");
    if (!form) return;
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      // Calculate dimension scores
      calculateScores();
  
      // Convert numeric scores to signs
      let hSign = getDimensionSign(dimensionScores.H);
      let ySign = getDimensionSign(dimensionScores.Y);
      let wSign = getDimensionSign(dimensionScores.W);
  
      // Determine the final archetype
      const archetype = determineArchetype(hSign, ySign, wSign);
  
      // Display the result in a <div id="archetype-result">
      let resultDiv = document.getElementById("archetype-result");
      if (!resultDiv) {
        resultDiv = document.createElement("div");
        resultDiv.id = "archetype-result";
        form.insertAdjacentElement("afterend", resultDiv);
      }
  
      resultDiv.innerHTML = `
        <h2>Your Reading Archetype</h2>
        <p><strong>${archetype}</strong></p>
        <p>(H: ${dimensionScores.H}, Y: ${dimensionScores.Y}, W: ${dimensionScores.W})</p>
      `;
  
      // Optional: smoothly scroll to the result
      resultDiv.scrollIntoView({ behavior: "smooth" });
    });
  });
  
