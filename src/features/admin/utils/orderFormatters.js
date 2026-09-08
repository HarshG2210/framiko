import { normalizeMediaUrl } from "../../../utils/constant";

/**
 * Resolve media URLs, handling both absolute and relative paths
 */
export const resolveMediaUrl = (url) => normalizeMediaUrl(url);

/**
 * Format date values with fallback
 */
export const fmtDate = (val) => (val ? new Date(val).toLocaleString() : "—");

/**
 * Format generic values with null/undefined/boolean handling
 */
export const fmtVal = (val) => {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
};

/**
 * Format currency values
 */
export const fmtCurrency = (val) =>
  val === null || val === undefined || val === "" ? "—" : `₹${val}`;

/**
 * Get badge color scheme for payment status
 */
export const paymentColor = (status) => {
  switch (status) {
    case "paid":
      return "green";
    case "pending":
      return "orange";
    case "failed":
      return "red";
    default:
      return "gray";
  }
};

/**
 * Get badge color scheme for order status
 */
export const orderColor = (status) => {
  switch (status) {
    case "delivered":
      return "green";
    case "confirmed":
      return "blue";
    case "cancelled":
      return "red";
    case "shipped":
      return "purple";
    default:
      return "gray";
  }
};

/**
 * Format customer name from user object
 */
export const formatCustomerName = (user) => {
  if (!user) return "—";
  const { first_name = "", last_name = "" } = user;
  return (first_name + " " + last_name).trim() || "—";
};
