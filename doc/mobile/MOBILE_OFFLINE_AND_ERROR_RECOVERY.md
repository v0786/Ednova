# EDNOVA Mobile Offline & Error Recovery Specification

## 1. Overview
The mobile app resilience layer provides network state monitoring (`MobileNetworkState`), request timeout management (10s threshold), session expiry recovery, and transparent user feedback states (`SAVED`, `PENDING`, `FAILED`, `NOT SENT`).

---

## 2. Infrastructure Components
- **`SharedOfflineBanner`**: Renders real-time network connectivity banner across all workspace pages.
- **`SharedLoadingState`**: Accessible spinner and progress text.
- **`SharedErrorState`**: Safe error message container with explicit retry button.
- **`SharedEmptyState`**: Zero-state indicator for empty rosters or notices.
- **`normalizeMobileError()`**: Error normalizer ensuring stack traces, SQL syntax, or internal endpoints are stripped before presentation to the user.
