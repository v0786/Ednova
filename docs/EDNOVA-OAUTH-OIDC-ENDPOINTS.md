# EDNOVA — LIVE SUPABASE OAUTH 2.1 & OIDC ENDPOINTS

This document outlines the official OAuth 2.1 and OpenID Connect (OIDC) endpoints for integrating third-party authentication and identity verification with your EDNOVA platform.

---

## 1. 🔑 OFFICIAL LIVE OAUTH 2.1 ENDPOINTS

| Endpoint Type | Protocol | Endpoint URL |
|---|---|---|
| **Authorization Endpoint** | OAuth 2.1 | `https://wvvfremfijuuzurbyyyl.supabase.co/auth/v1/oauth/authorize` |
| **Token Endpoint** | OAuth 2.1 | `https://wvvfremfijuuzurbyyyl.supabase.co/auth/v1/oauth/token` |
| **JWKS Key Set** | JSON Web Key | `https://wvvfremfijuuzurbyyyl.supabase.co/auth/v1/.well-known/jwks.json` |
| **OIDC Discovery** | OpenID Connect | `https://wvvfremfijuuzurbyyyl.supabase.co/auth/v1/.well-known/openid-configuration` |

---

## 2. 💻 IN-APP USAGE

Import `SUPABASE_OAUTH_CONFIG` directly in your code:

```typescript
import { SUPABASE_OAUTH_CONFIG, signInWithGoogle } from '@/lib/supabaseClient';

console.log('Authorization Endpoint:', SUPABASE_OAUTH_CONFIG.authorizationEndpoint);
console.log('Token Endpoint:', SUPABASE_OAUTH_CONFIG.tokenEndpoint);
console.log('JWKS URI:', SUPABASE_OAUTH_CONFIG.jwksUri);
console.log('OIDC Discovery:', SUPABASE_OAUTH_CONFIG.oidcDiscoveryUrl);
```

---

## 3. 🌐 GOOGLE OAUTH & THIRD-PARTY INTEGRATION

To configure Google OAuth sign-in on Vercel (`https://ednova-lake.vercel.app`):

1. **Google Cloud Console**:
   - Authorized JavaScript origins: `https://ednova-lake.vercel.app`, `https://wvvfremfijuuzurbyyyl.supabase.co`
   - Authorized redirect URIs: `https://wvvfremfijuuzurbyyyl.supabase.co/auth/v1/callback`
2. **Supabase Dashboard**:
   - Authentication → Providers → Google → Input Client ID and Client Secret.
   - Redirect URL: `https://ednova-lake.vercel.app/login`
