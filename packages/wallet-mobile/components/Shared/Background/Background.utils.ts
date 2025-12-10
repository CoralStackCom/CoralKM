/**
 * Gets the current phase of the day looking at the
 * current hour on the user's system
 */

export function getCurrentPhase() {
  const hour = new Date().getHours();
  switch (true) {
    case hour < 6:
      return "night";
    case hour < 8:
      return "morning";
    case hour < 18:
      return "day";
    case hour < 20:
      return "evening";
    default:
      return "night";
  }
}
export function getPhaseGradients(phase: string) {
  switch (phase) {
    case "morning":
      return {
        land: ["#F16872", "#FF9454"],
        sky: ["#F16872", "#FF9454"],
        water: ["#F16872", "#FF9454"],
        underwater: ["#FF9454", "#2A86BB"],
      };
    case "day":
      return {
        land: ["#F8D092", "#47CCAF"],
        sky: ["#F8D092", "#47CCAF"],
        water: ["#F8D092", "#47CCAF"],
        underwater: ["#2A86BB", "#F8D092"],
      };
    case "evening":
      return {
        land: ["#1B5678", "#47CCAF"],
        sky: ["#1B5678", "#47CCAF"],
        water: ["#1B5678", "#47CCAF"],
        underwater: ["#47CCAF", "#1B5678"],
      };
    case "night":
      return {
        land: ["#092230", "#10364C"],
        sky: ["#092230", "#10364C"],
        water: ["#092230", "#10364C"],
        underwater: ["#10364C", "#092230"],
      };
    default:
      return {
        land: ["#9FE4D5", "#88DECB"],
        sky: ["#9FE4D5", "#88DECB"],
        water: ["#9FE4D5", "#88DECB"],
        underwater: ["#47CCAF", "#1B97DE"],
      };
  }
}
