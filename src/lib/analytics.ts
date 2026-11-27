export type AnalyticsEventName =
  | "role_login_completed"
  | "package_filter_applied"
  | "zero_result_customize_clicked"
  | "heatmap_date_hovered"
  | "heatmap_date_selected"
  | "customization_form_started"
  | "customization_form_submitted"
  | "checkout_step_completed"
  | "checkout_fallback_triggered"
  | "post_checkout_survey_submitted";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: AnalyticsEventName,
  payload: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") return;
  const eventRecord = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventRecord);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
}
