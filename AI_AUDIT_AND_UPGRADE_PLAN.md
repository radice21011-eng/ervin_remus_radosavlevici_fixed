# AI Audit & Upgrade Plan

## 🚀 Project Overview

The project, "RADOS v4.0 - Strategic Analysis" (soon to be v5.0), is an interactive web application designed for celestial cartography and strategic analysis. It allows users to view, sort, search, and compare celestial objects (star systems and galaxies) based on a proprietary "ErvinRemus" ranking algorithm. The application incorporates advanced features such as AI-powered strategic analysis, mission planning, and containment protocols for anomalous objects, leveraging Google's GenAI. It includes a dynamic simulation environment that updates celestial object properties over time, an asset management system for acquired assets, and a detailed event log. The application emphasizes high security and proprietary ownership, as indicated by its prominent NDA disclaimers and basic login screen. It is built using React, TypeScript, and Vite, with TailwindCSS for styling.

The primary user goal, inferred from the application's capabilities, is to provide a comprehensive platform for strategic decision-making in a simulated interstellar environment, optimizing resource acquisition, managing threats, and planning complex missions.

## 🐛 Bug Fixes & Repairs

### 1. Incorrect Dependency `@google` in `package.json`

*   **File:** `apps/ervinremusradosavlevicifixed/package.json`
*   **Explanation:** The `package.json` lists `@google: "latest"` as a dependency. This is not a valid or specific package. The `@google/genai` package is already correctly listed and used for AI functionalities. This entry is likely a typo or misunderstanding and causes an unnecessary dependency.
*   **Corrected Code:**

    ```json
    {
      "name": "ervin-remus-radosavlevici",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
      "dependencies": {
        "react": "18.2.0",
        "react-dom": "18.2.0",
        "@google/genai": "0.15.0",
        "jspdf": "latest",
        "jspdf-autotable": "latest",
        "uuid": "latest"
        // REMOVE: "@google": "latest",
        // REMOVE: "path": "latest"
      },
      "devDependencies": {
        "@types/node": "^22.14.0",
        "typescript": "~5.8.2",
        "vite": "latest"
      }
    }
    ```

### 2. Incorrect Dependency `path` in `package.json`

*   **File:** `apps/ervinremusradosavlevicifixed/package.json`
*   **Explanation:** The `path: "latest"` dependency is listed. The `path` module is a Node.js built-in module and is only correctly used in `vite.config.ts` (a Node.js environment). It should not be listed as a client-side dependency for a React application, as it's not a browser-compatible module and will lead to unnecessary bundling or errors if attempted to be used in client code.
*   **Corrected Code:** (See above, removed from `package.json`)

### 3. Incorrect JSON Parsing for AI Responses

*   **File:** `apps/ervinremusradosavlevicifixed/components/App.tsx`
*   **Explanation:** When using `responseMimeType: "application/json"` with `@google/genai`, the `response.text` property provides a string representation of the JSON, which is then `JSON.parse`d. The more robust and type-safe way to access the parsed JSON content is to use `response.json()`, which directly returns the parsed object if the content is valid JSON. This simplifies the code and is the intended method for JSON responses. This issue affects `handleSelectObject` (strategic analysis), `handleGenerateMission`, `handleGenerateContainmentPlan`, `handleGenerateAIOverview`, and `handleGenerateNewObject`.
*   **Corrected Code (Example for `handleSelectObject` - apply similarly to others):**

    ```typescript
    // In App.tsx, inside handleSelectObject
    // OLD: const jsonResponse = JSON.parse(response.text);
    // NEW:
    const jsonResponse = await response.json();
    setStrategicAnalysis(jsonResponse.analysisPoints);
    // ... similarly for handleGenerateMission, handleGenerateContainmentPlan, handleGenerateAIOverview, handleGenerateNewObject
    ```

### 4. Incomplete AI Schema Definition for `Planet` Properties

*   **File:** `apps/ervinremusradosavlevicifixed/components/App.tsx`
*   **Explanation:** In `handleGenerateNewObject`, the `responseSchema` for `planets.items` is defined as `type: Type.OBJECT`, but the `properties` of the `Planet` object are entirely missing. This means the AI might generate planets without expected fields (like `name`, `insolation_s_earth`, etc.), leading to incomplete data and potential runtime errors when the application tries to access these properties.
*   **Corrected Code:**

    ```typescript
    // In App.tsx, inside handleGenerateNewObject
    config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                object: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['star_system', 'galaxy'] },
                        star_l_lsun: { type: Type.NUMBER, nullable: true },
                        total_l_lsun: { type: Type.NUMBER, nullable: true },
                        variability: { type: Type.NUMBER, nullable: true },
                        threat_level: { type: Type.NUMBER },
                        economic_value: { type: Type.NUMBER },
                        isProcedural: { type: Type.BOOLEAN },
                        planets: {
                            type: Type.ARRAY,
                            nullable: true,
                            items: {
                                type: Type.OBJECT,
                                properties: { // <<< ADDED full Planet properties definition
                                    name: { type: Type.STRING },
                                    insolation_s_earth: { type: Type.NUMBER, nullable: true },
                                    eq_temp_K: { type: Type.NUMBER, nullable: true },
                                    radius_Re: { type: Type.NUMBER, nullable: true },
                                    orbital_period_days: { type: Type.NUMBER, nullable: true },
                                    semi_major_axis_au: { type: Type.NUMBER, nullable: true },
                                    resource_potential: { type: Type.NUMBER, nullable: true },
                                    economic_value: { type: Type.NUMBER, nullable: true },
                                    threat_level: { type: Type.NUMBER, nullable: true }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ```

### 5. Arbitrary Threat Level Reduction Upon Anomaly Clearanc

*   **File:** `apps/ervinremusradosavlevicifixed/components/App.tsx`
*   **Explanation:** In the simulation loop, when an anomaly's expiry year is reached, the `threat_level` is set to `(obj.threat_level ?? 0.5) / 2`. This uses an arbitrary `0.5` as a fallback if `threat_level` is `null`/`undefined` and divides it by 2. This logic might not accurately represent the resolution of a threat. A more precise approach would be to reduce it by a fixed, small amount or return it to a known baseline (e.g., `0.1` or `0.0`). Given the dynamic nature, a fixed reduction seems more appropriate.
*   **Corrected Code:**

    ```typescript
    // In App.tsx, inside simulation useEffect
    // OLD: return { ...obj, status: null, status_expiry_year: undefined, threat_level: (obj.threat_level ?? 0.5) / 2 };
    // NEW:
    return { ...obj, status: null, status_expiry_year: undefined, threat_level: Math.max(0, (obj.threat_level ?? 0.5) - 0.2) }; // Reduce by 0.2, ensuring non-negative
    ```

## 🛡️ Security Hardening Report

### 1. Exposure of API Keys in Client-Side Code (A07: Identification and Authentication Failures)

*   **Risk:** The `GEMINI_API_KEY` is loaded from `.env.local` by Vite (`loadEnv`) and directly injected into the client-side bundle via `define` in `vite.config.ts`. While `.env.local` is `.gitignore`d, the key itself becomes visible in the client's browser developer tools or by viewing the compiled JavaScript source. An attacker can easily extract this key and abuse the Gemini API, leading to unauthorized usage, quota exhaustion, and potentially financial costs for the developer.
*   **Secure Code Replacement/Mitigation:**
    *   **Backend Proxy (Recommended for Production):** The most secure approach is to use a server-side proxy to make calls to the Gemini API. The client application would send requests to its own backend, which then forwards them to Gemini using the API key securely stored on the server. This prevents the key from ever being exposed to the client.
    *   **Vite Configuration Adjustment:** Remove API key injection from `vite.config.ts`.

    ```typescript
    // apps/ervinremusradosavlevicifixed/vite.config.ts
    // OLD:
    // define: {
    //   'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    //   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    // },
    // NEW (No direct injection):
    define: {}, // Or only define non-sensitive environment variables
    ```
    *   **Client-Side `App.tsx` Adjustment:** The `GoogleGenAI` instance would then need to be configured to point to your new backend proxy endpoint. If no backend is implemented, the API key remains exposed.

### 2. Lack of Robust User Authentication (A07: Identification and Authentication Failures / A01: Broken Access Control)

*   **Risk:** The `LoginScreen` component only requires a user to click "Acknowledge & Proceed" to gain full access to the application. There is no actual authentication mechanism (e.g., username/password, OAuth, MFA). This means anyone can access a supposedly "secured project," making it highly vulnerable to unauthorized access and data manipulation. The NDA disclaimer is purely cosmetic without enforcement.
*   **Secure Code Replacement/Mitigation:** Implement a proper authentication system.
    *   **For a Production-Ready Application:**
        *   Integrate with an identity provider (Auth0, Firebase Auth, AWS Cognito, Google Sign-In, etc.).
        *   Implement a full-fledged backend authentication system using JWTs, sessions, or similar, requiring users to log in with credentials.
        *   Store user credentials securely (hashed passwords with strong algorithms).
    *   **Minimal Improvement (Proof of Concept):** Add a simple password input field to the `LoginScreen` and check against a securely stored hash (though for true security, this should be done server-side).

    ```typescript
    // apps/ervinremusradosavlevicifixed/components/LoginScreen.tsx (Conceptual addition for minimal security)
    import React, { useState } from 'react';

    interface LoginScreenProps {
      onAcknowledge: () => void;
    }

    const CORRECT_PASSWORD_HASH = "d404559f602eab6fd60f400ce33f7579"; // Example hash for "securepassword" - DO NOT USE IN PRODUCTION

    export const LoginScreen: React.FC<LoginScreenProps> = ({ onAcknowledge }) => {
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');

      const handleLogin = () => {
        // In a real app, send password to backend for hashing and comparison
        // For demonstration, use a simple client-side hash comparison (HIGHLY INSECURE FOR REAL APPS)
        const hashedPassword = /* simple hash function for demo */(password);
        if (hashedPassword === CORRECT_PASSWORD_HASH) { // Placeholder for actual auth check
          onAcknowledge();
        } else {
          setError('Incorrect access code. Access denied.');
        }
      };

      // ... rest of the component
      return (
        <div className="h-screen w-screen bg-gray-900 text-gray-300 flex flex-col items-center justify-center p-4 font-mono">
            {/* ... existing ASCII art and notice */}
            <div className="mt-8 max-w-2xl mx-auto">
                {/* ... existing header and notice */}
                <input
                    type="password"
                    placeholder="Enter Access Code"
                    className="w-full mt-4 p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleLogin(); }}
                />
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                <button
                    onClick={handleLogin} // Changed to handleLogin
                    className="mt-8 px-8 py-3 text-base font-bold text-white bg-indigo-600 rounded-lg border border-indigo-500 shadow-lg shadow-indigo-600/30
                            hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300 font-sans"
                >
                    Acknowledge & Proceed
                </button>
            </div>
        </div>
      );
    };
    ```

### 3. Potential for Cross-Site Scripting (XSS) (A03: Injection)

*   **Risk:** Several parts of the application render dynamic strings directly into the DOM (e.g., `item.name`, `planet.name`, AI-generated `StrategicPoint.text`, `MissionStep.title/description`, `ContainmentStep.stage_name/objective`, `ChatMessage.content`, `EventLogEntry.message`, `Toast.message`, `Snapshot.name`). If an attacker can inject malicious JavaScript into these strings (e.g., through AI prompts, or if future features allow user-defined names), it could lead to XSS attacks, compromising user data or application integrity. Although the current `EXAMPLE_DATASET` is safe and AI output is JSON, the client-side parsing and direct rendering creates a potential vector.
*   **Secure Code Replacement/Mitigation:**
    *   **Strict Input Sanitization:** For any user-provided or potentially untrusted string input, sanitize it on both the client (before sending to AI/storage) and server (if applicable). Use a library like `DOMPurify` to clean HTML strings.
    *   **Content Security Policy (CSP):** Implement a robust CSP header on the web server to restrict which sources are allowed to execute scripts, load styles, etc. This would prevent injected scripts from running. (Requires server-side configuration, not applicable to frontend code directly).
    *   **Auto-escaping Frameworks:** React inherently helps with XSS by escaping string content by default when rendering JSX. However, if content is explicitly rendered using `dangerouslySetInnerHTML`, or if string manipulation leads to HTML injection before rendering, XSS can occur. In this codebase, direct rendering of string properties is generally safe due to React's auto-escaping. The primary risk comes from the AI *generating* content that *looks* like valid HTML/JS, which React would then escape, displaying it as plain text. The real XSS risk would be if the AI generated something like `{"name": "<img src=x onerror=alert('XSS')>"}` and it wasn't escaped before attribute injection. However, the current code renders `item.name` *as text*, so `<img src=x onerror=alert('XSS')>` would appear as text, not as an executable image. The main concern is with the `JSON.parse(response.text)` as `response.text` could contain raw HTML.
    *   **Recommendation:** While React provides good default escaping, ensure that future features involving user-generated content or complex AI outputs that could return HTML/JS snippets are explicitly sanitized (e.g., if AI ever returns `innerHTML` type content) or rendered in text-only contexts. For this current application, the risk is lower due to React's handling, but if AI outputs become more complex (e.g. Markdown with HTML support), it needs `DOMPurify`.

### 4. Missing HTTP Security Headers (Server-Side Concern)

*   **Risk:** While the provided code is purely client-side, a production deployment would require a web server. Without server-side security middleware (like Helmet for Node.js/Express or equivalent for other stacks), the application would be vulnerable to common web attacks, including:
    *   **Clickjacking:** (Missing `X-Frame-Options` or `Content-Security-Policy: frame-ancestors`)
    *   **Cross-Site Scripting (XSS):** (Weak or missing `Content-Security-Policy`)
    *   **MIME-type Sniffing:** (Missing `X-Content-Type-Options`)
    *   **Insecure Cookies:** (Missing `Secure`, `HttpOnly` flags, etc.)
    *   **Missing HSTS:** (Allows downgrade attacks)
*   **Secure Code Replacement/Mitigation:**
    *   **Implement a Web Server with Security Middleware:** If deploying with Node.js/Express, use `helmet`. For other frameworks, use their equivalent security packages.
    *   **Example for an Express.js Backend:**

    ```javascript
    // In your server's app.js/index.js
    const express = require('express');
    const helmet = require('helmet');
    const cors = require('cors'); // If client and server are on different origins

    const app = express();

    // Enable CORS for allowed origins if needed
    app.use(cors({
      origin: 'https://your-frontend-domain.com', // Replace with your actual frontend domain
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));

    // Use Helmet for various security headers
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://esm.sh", "https://fonts.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://*", "https://www.transparenttextures.com"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"], // Allow AI API calls
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
      },
    }));
    app.use(helmet.xFrameOptions({ action: 'DENY' }));
    app.use(helmet.noSniff());
    app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));

    // ... your routes and other middleware
    ```

## ✨ Performance & Refactoring Plan

### 1. Externalize Inline Styles into CSS Files

*   **Problem:** The `index.html` file contains a massive inline `<style>` block for custom animations, scrollbars, and specific component styles. This makes the HTML bloated, harder to maintain, and prevents proper CSS caching.
*   **Refactoring Plan:**
    *   Move all custom CSS rules from `index.html` into a dedicated CSS file (e.g., `src/styles/app.css` or extend `index.css`).
    *   Ensure `index.css` is properly imported in `index.tsx` or `index.html` for Vite to process.
*   **Example (Conceptual):**

    ```html
    <!-- apps/ervinremusradosavlevicifixed/index.html -->
    <!-- OLD: <style>...</style> -->
    <!-- Keep only the link to CSS -->
    <link rel="stylesheet" href="/index.css">
    </head>
    ```
    ```css
    /* apps/ervinremusradosavlevicifixed/index.css */
    /* All the custom CSS from index.html's <style> block goes here */
    html {
        font-family: 'Inter', sans-serif;
    }
    /* ... rest of the styles */
    ```

### 2. Centralize Utility Functions (e.g., `formatValue`, Weight Normalization)

*   **Problem:** The `formatValue` function (for currency/economic values) is duplicated across `RankingCard.tsx`, `DetailViewModal.tsx`, `AssetManagerPanel.tsx`, and `CapitalDisplay.tsx`. Similarly, the weight normalization logic in `SettingsPanel.tsx` is repetitive for star system and galaxy weights.
*   **Refactoring Plan:**
    *   Create a `src/utils/formatters.ts` file for `formatValue`.
    *   Create a `src/utils/math.ts` file for a generic weight normalization function.
*   **Example (`src/utils/formatters.ts`):**

    ```typescript
    // apps/ervinremusradosavlevicifixed/utils/formatters.ts (New File)
    export const formatValue = (value: number): string => {
        if (value >= 1e12) return `§${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `§${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `§${(value / 1e6).toFixed(2)}M`;
        return `§${value.toLocaleString()}`;
    };

    export const formatCapital = (value: number): string => {
        if (value >= 1e12) return `§${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `§${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `§${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `§${(value / 1e3).toFixed(1)}K`;
        return `§${value.toFixed(0)}`;
    };
    ```
    Then, import and use: `import { formatValue, formatCapital } from '../utils/formatters';`

*   **Example (`src/utils/math.ts` - for weight normalization):**

    ```typescript
    // apps/ervinremusradosavlevicifixed/utils/math.ts (New File)
    export function normalizeWeights<T extends Record<string, number>>(
      currentWeights: T,
      changedKey: keyof T,
      newValue: number
    ): T {
      const oldVal = currentWeights[changedKey];
      const diff = newValue - oldVal;

      let newWeights: T = { ...currentWeights, [changedKey]: newValue };

      const otherKeys = (Object.keys(currentWeights) as Array<keyof T>).filter(k => k !== changedKey);
      let otherSum = otherKeys.reduce((sum, key) => sum + currentWeights[key], 0);

      if (otherSum > 0) {
        otherKeys.forEach(key => {
          const proportion = currentWeights[key] / otherSum;
          newWeights[key] -= diff * proportion;
          newWeights[key] = Math.max(0, newWeights[key]); // Ensure non-negative
        });
      }

      const total = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
      if (total > 0) {
        (Object.keys(newWeights) as Array<keyof T>).forEach(key => {
          newWeights[key] /= total;
        });
      }

      return newWeights;
    }
    ```
    Then, update `SettingsPanel.tsx` to use this.

### 3. Extract Common UI Patterns into Reusable Components

*   **Problem:** Components like `ScoreBar`, `ThreatBar`, `DataPill`, `ActionButton`, `AssetItem`, `EventItem` have highly similar structural patterns (e.g., `bg-gray-200/50 dark:bg-gray-800/50 p-3 rounded-lg`). While they are already components, further abstraction could reduce boilerplate and improve consistency.
*   **Refactoring Plan:**
    *   Create a generic `CardBase` or `PanelItem` component that handles common styling (background, padding, border-radius, shadows).
    *   Refactor individual items to use this `CardBase`.
*   **Example (`components/common/PanelItem.tsx` - New File):**

    ```typescript
    // apps/ervinremusradosavlevicifixed/components/common/PanelItem.tsx
    import React from 'react';

    interface PanelItemProps {
      children: React.ReactNode;
      className?: string;
      onClick?: () => void;
    }

    export const PanelItem: React.FC<PanelItemProps> = ({ children, className, onClick }) => (
      <div
        className={`bg-gray-200/50 dark:bg-gray-800/50 p-3 rounded-lg ${className || ''}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
    ```
    Then, update components like `PlanetInfo`, `AssetItem`, `EventItem` to use `PanelItem`.

### 4. Optimize AI Prompt Management

*   **Problem:** AI prompt strings are long, complex, and embedded directly within `App.tsx`. This makes them harder to read, manage, and reuse.
*   **Refactoring Plan:**
    *   Create a `src/ai/prompts.ts` file to store prompt templates as constants or functions.
    *   Use template literals to insert dynamic data into these templates.
*   **Example (`src/ai/prompts.ts` - New File):**

    ```typescript
    // apps/ervinremusradosavlevicifixed/ai/prompts.ts
    export const STRATEGIC_ANALYSIS_PROMPT = (itemData: string) =>
      `Based on the following data for "${JSON.parse(itemData).name}", provide a concise strategic analysis. Identify key points for resources, risks, opportunities, and science. Data: ${itemData}`;

    export const MISSION_PLAN_PROMPT = (itemName: string, itemData: string) =>
      `Generate a multi-phase strategic mission plan for "${itemName}". If it is a star system, also identify a specific "Point of Interest" with coordinates as percentages (e.g., x: "50%", y: "30%") and a label. Data: ${itemData}`;

    // ... other prompts
    ```
    Then, update `App.tsx` to import and use these templates.

### 5. Improve Magic Numbers Management

*   **Problem:** Several "magic numbers" are present (e.g., `0.0000000001` for income, numerical ranges in `kaieService.ts` indices like `240`, `310`, `288`, `48`). These are hard to understand and change.
*   **Refactoring Plan:**
    *   Define these numbers as named constants in `src/components/constants.ts` or a new `src/config/simulation.ts` file.
*   **Example (`src/components/constants.ts`):**

    ```typescript
    // apps/ervinremusradosavlevicifixed/components/constants.ts
    // ... existing constants

    export const INCOME_RATE_PER_VALUE = 0.0000000001; // Example: 0.00000001% of economic value per year
    export const THREAT_REDUCTION_ON_CLEAR = 0.2; // How much threat level is reduced when status clears
    export const HPI_TEMP_MIN_K = 240.0;
    export const HPI_TEMP_MAX_K = 310.0;
    export const HPI_TEMP_PEAK_K = 288.0;
    export const HPI_TEMP_HALF_WIDTH = 48.0;
    export const ECONOMIC_INDEX_MIN_LOG10_VALUE = 9; // 10^9 (Billion)
    export const ECONOMIC_INDEX_RANGE_LOG10 = 9; // Range up to 10^18 (Quintillion)
    export const THREAT_MAX_SCORE_PENALTY = 0.5; // 50% penalty at 1.0 threat

    // ... and so on
    ```
    Then replace raw numbers with these constants.

### 6. Introduce Web Workers for Heavy Computation (Performance)

*   **Problem:** The `computeRankings` function, while synchronous, processes the entire `celestialData` array. As the dataset grows, this could become a performance bottleneck, blocking the main UI thread.
*   **Refactoring Plan:**
    *   Offload `computeRankings` to a Web Worker. This would allow the ranking calculation to run in a separate thread, keeping the UI responsive.
*   **Implementation Steps:**
    1.  Create `src/workers/rankingWorker.ts`.
    2.  Move `computeRankings` and its dependencies (`energyAvailabilityIndex`, etc.) into the worker file.
    3.  In `useCelestialData`, create a worker instance and send data to it, listening for messages back.

    ```typescript
    // apps/ervinremusradosavlevicifixed/workers/rankingWorker.ts (New File)
    import { computeRankings } from '../components/kaieService'; // Worker imports the pure function

    onmessage = (e) => {
      const { dataset, weights } = e.data;
      const result = computeRankings(dataset, weights);
      postMessage(result);
    };
    ```

    ```typescript
    // apps/ervinremusradosavlevicifixed/components/useCelestialData.ts (Changes)
    // ... imports
    import { computeRankings } from './kaieService'; // Keep for initial/direct use, or remove if always worker
    // Add worker setup:
    const rankingWorker = useMemo(() => new Worker(new URL('../workers/rankingWorker.ts', import.meta.url), { type: 'module' }), []);

    useEffect(() => {
        rankingWorker.onmessage = (e) => {
            const { results: newResults, timestamp: ts } = e.data;
            setRankings(previousRankings => {
                // ... same rank change logic as before
                return newResults;
            });
            setTimestamp(new Date(ts).toLocaleString());
            setLoading(false);
        };
        rankingWorker.onerror = (err) => {
            setError('Failed to compute ranking data in worker.');
            console.error(err);
            setLoading(false);
        };
        // Cleanup worker on unmount
        return () => { rankingWorker.terminate(); };
    }, [rankingWorker, ervinRemusWeights]); // Add rankingWorker to dependencies

    const recalculateAndSetRankings = useCallback((data: CelestialObject[]) => {
      setLoading(true);
      setError(null);
      rankingWorker.postMessage({ dataset: data, weights: ervinRemusWeights });
    }, [rankingWorker, ervinRemusWeights]);

    // Initial load:
    useEffect(() => {
        recalculateAndSetRankings(celestialData);
    }, [celestialData, recalculateAndSetRankings]);
    ```

## 📦 Dependency Upgrade Strategy

### 1. Pinning "latest" Dependencies to Specific Versions

*   **Problem:** Several dependencies are specified with `"latest"` in `package.json` (`jspdf`, `jspdf-autotable`, `uuid`, `vite`). This is problematic for production builds as it can lead to non-reproducible builds (different `npm install` runs could yield different versions, potentially introducing breaking changes or bugs). The `esm.sh` import map uses specific versions, but `package.json` should align.
*   **Recommendation:** Pin these dependencies to their exact major or minor versions as used in `esm.sh` or the latest stable versions known to be compatible. Use `npm install <package>@<version>` or `npm update <package>` followed by `npm shrinkwrap` or checking `package-lock.json` and then updating `package.json` manually if desired.

    ```json
    {
      "dependencies": {
        "react": "18.2.0",
        "react-dom": "18.2.0",
        "@google/genai": "0.15.0", // Recommend moving to ^0.15.0 for minor updates or newer stable
        "jspdf": "^2.5.1", // From esm.sh: 2.5.1
        "jspdf-autotable": "^3.8.2", // From esm.sh: 3.8.2
        "uuid": "^9.0.1" // From esm.sh: 9.0.1
      },
      "devDependencies": {
        "@types/node": "^22.14.0",
        "typescript": "~5.8.2", // Recommend moving to latest stable ^5.X.X
        "vite": "^5.2.0" // Pin to a stable major/minor version
      }
    }
    ```

### 2. Updating `@google/genai` and `typescript`

*   **Problem:** `@google/genai` is at `0.15.0` and `typescript` is at `~5.8.2`. While not critically outdated, keeping core dependencies updated provides access to new features, performance improvements, and security patches.
*   **Recommendation:**
    *   **`@google/genai`**: Check the official npm page or GitHub for the latest stable version and its changelog. Upgrade to the latest `0.x` series (e.g., `^0.17.0`) or a new major version if breaking changes are manageable.
        *   `npm install @google/genai@latest` (and then update `package.json` to pin)
    *   **`typescript`**: Upgrade to the latest stable TypeScript version (e.g., `^5.4.0` or `^5.5.0` as of writing this, newer than `~5.8.2`).
        *   `npm install typescript@latest --save-dev`

### 3. Modernize Asset Loading (TailwindCSS and ESM CDN)

*   **Problem:** TailwindCSS is loaded directly from a CDN (`cdn.tailwindcss.com`). While convenient for development, for a "production-ready" application:
    *   It pulls a large CSS file, even if only a fraction of classes are used.
    *   It's a remote dependency, adding a point of failure and potential latency.
    *   It prevents advanced optimizations like purging unused CSS, which drastically reduces file size.
*   **Problem:** Other key dependencies (`react`, `react-dom`, `jspdf`, `uuid`, `@google/genai`) are loaded via `esm.sh` import maps. This is useful for browser-native ESM in development/prototyping but can introduce performance overhead (multiple HTTP requests, lack of bundling) and reliance on an external CDN for production.
*   **Recommendation:**
    *   **TailwindCSS Local Build:** Configure TailwindCSS as part of the Vite build process using PostCSS. This allows for JIT compilation, tree-shaking (purging unused styles), and minification, resulting in a much smaller and optimized CSS bundle.
        *   **Steps:** `npm install -D tailwindcss postcss autoprefixer`, initialize `tailwind.config.js`, update `postcss.config.js`, and import `index.css` (which would then contain Tailwind directives).
    *   **Bundle ESM Dependencies:** Remove the `<script type="importmap">` block from `index.html`. Allow Vite to bundle all JavaScript dependencies. Vite is designed for this and will handle tree-shaking, code splitting, and minification automatically for production builds, providing better performance, reliability, and control over dependency versions.
        *   **Steps:** Remove `importmap` from `index.html`. Ensure all imports in `index.tsx` and components are standard Node-style imports (which they already are). Vite will pick them up.

## 💡 Proposed New Features

### 1. "Quantum Nexus" Inter-Object Interaction Module

**Description:** This feature would allow users to define and simulate strategic interactions between multiple selected celestial objects. Users could set up hypothetical trade routes, defensive alliances, or even conflict scenarios, and the AI (Gemini) would generate a detailed simulation outcome, including economic shifts, political repercussions, and resource flow changes. This enhances the "strategic analysis" aspect by allowing proactive planning and "what-if" scenarios.

**Implementation Steps:**
1.  **UI Extension:**
    *   In `ComparisonView` or `DetailViewModal`, add a "Simulate Interaction" button or a dedicated "Quantum Nexus" tab.
    *   A new modal/panel for configuring interactions:
        *   Select 2-5 celestial objects.
        *   Choose interaction type (Trade, Alliance, Conflict).
        *   Input parameters (e.g., trade volume, alliance terms, conflict intensity).
    *   Display simulated results, perhaps with a visual timeline or report.
2.  **Backend/AI Integration:**
    *   Create new AI prompts for each interaction type, providing current object data and interaction parameters.
    *   Example Prompt (Trade): "Given objects A and B, with economic values X and Y, simulate a trade agreement for Z resources. Outline outcomes for both, including economic impacts, risks, and potential new opportunities."
    *   The AI response schema would define the simulation report: `outcome_summary`, `object_A_impacts`, `object_B_impacts`, `event_log_entries`.
3.  **Simulation & Data Model Update:**
    *   Parse the AI's simulation outcome.
    *   Update the `economic_value`, `threat_level`, and `status` of the involved celestial objects in `celestialData`.
    *   Add relevant entries to the `eventLog`.
    *   Potentially introduce new `relationship` properties in `CelestialObject` type to track alliances/conflicts.

### 2. "Predictive Threat Analysis" with AI

**Description:** This feature would leverage AI to proactively scan historical event logs and current object data to identify patterns indicative of future threats. It would generate predictive alerts, highlight high-risk areas on the starmap, and suggest preemptive countermeasures. This moves the application from reactive to proactive threat management.

**Implementation Steps:**
1.  **Data Preprocessing:**
    *   The AI needs access to historical data (e.g., past `eventLog` entries, historical `threat_level` changes, economic fluctuations).
    *   Consider storing more granular historical data points for `CelestialObject` if current snapshots are not detailed enough.
2.  **UI Extension:**
    *   Add a "Predictive Analysis" button, perhaps near the "Global Strategic Analysis" button or in the Security Dashboard.
    *   A new section in the AI Overview Modal or a dedicated "Threat Forecast" panel.
    *   Visually represent predicted high-threat areas on the `StarmapView` (e.g., pulsating red zones, predictive vectors).
3.  **Backend/AI Integration:**
    *   Develop a new AI prompt: "Analyze the provided historical event log and current celestial data to identify emerging threat patterns. Predict potential future threat locations and types, and suggest 2-3 high-level countermeasures for each."
    *   AI response schema: `predicted_threats: { location: string, type: string, probability: number, year_range: string, suggested_countermeasures: string[] }[]`, `overall_threat_summary: string`.
    *   The prompt would pass the `eventLog` and a subset of current `rankings` data.
4.  **Actionable Insights:**
    *   Based on AI suggestions, provide quick actions within the UI (e.g., "Deploy Defensive Fleet to [System Name]", "Allocate Capital for Threat Mitigation").
    *   These actions could trigger `onIntervention` or new specific actions, incurring capital costs.

### 3. "Deep Scan" Resource Prospecting

**Description:** Enhance the economic and resource management aspect by allowing a "deep scan" of a selected celestial object (especially star systems). The AI would generate a more detailed, multi-layered resource map, identifying specific resource types (e.g., rare minerals, atmospheric gases, energy sources) and their estimated yields within the object, improving strategic investment decisions.

**Implementation Steps:**
1.  **UI Extension:**
    *   Add a "Deep Scan" button in the `DetailViewModal` for `star_system` objects.
    *   A new tab or section within the `DetailViewModal` to display the detailed resource map and report.
    *   Visually represent the resource distribution, perhaps overlaying the `CelestialViewer3D` or `OrbitalView` with heatmaps or icons.
2.  **Backend/AI Integration:**
    *   New AI prompt: "Perform a detailed resource prospecting deep scan for the celestial object: [JSON.stringify(item)]. Identify specific resource types (e.g., rare metals, exotic elements, energy), their estimated abundance, and optimal extraction locations (relative coordinates if applicable). Categorize resources by type and economic significance."
    *   AI response schema: `resource_report: { type: string, abundance_g_tons: number, primary_location: string, economic_significance: 'low'|'medium'|'high', extraction_notes: string }[]`, `overall_prospecting_summary: string`.
3.  **Data Integration:**
    *   Update the `Planet` or `StarSystem` types to include `resource_deposits` (an array of `ResourceDeposit` objects).
    *   Display the generated resource report in the UI.
    *   Allow users to "invest" in specific extraction sites, potentially leading to increased `economic_value` and `income` over time based on successful extraction simulations.