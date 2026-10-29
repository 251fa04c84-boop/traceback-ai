export interface IncidentLog {
  id: string;
  timestamp: string;
  level: "ERROR" | "WARN" | "INFO";
  service: string;
  message: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

export interface MetricPoint {
  time: string;
  errorRate: number; // percentage, e.g. 42.8
  latencyP99: number; // ms, e.g. 3450
  cpuUsage: number; // percentage, e.g. 78
  memoryUsage: number; // percentage, e.g. 92
  activeConnections?: number;
}

export interface DeploymentEvent {
  releaseId: string;
  commitHash: string;
  author: string;
  timestamp: string;
  service: string;
  summary: string;
  diff: string;
  isStable: boolean;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  service: string;
}

export interface IncidentScenario {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  service: string;
  description: string;
  detectedAt: string;
  activeRelease: string;
  stableRelease: string;
  status: "INVESTIGATING" | "ACTION_PROPOSED" | "RECOVERING" | "RESOLVED" | "UNRESOLVED";
  metrics: MetricPoint[];
  healthyMetrics: MetricPoint[];
  logs: IncidentLog[];
  deployments: DeploymentEvent[];
  featureFlags: FeatureFlag[];
  requiredActions: {
    actionId: string;
    expectedParams: Record<string, any>;
    explanation: string;
  }[];
  postMortemTemplate: {
    rootCause: string;
    trigger: string;
    blastRadius: string;
    recommendedPrevention: string;
  };
}

export const SCENARIOS: IncidentScenario[] = [
  {
    id: "inc-8921",
    title: "Checkout Outage: HTTP 500 Spike After Release v2.4.1",
    severity: "CRITICAL",
    service: "checkout-service",
    description: "Checkout completion API experiencing a massive spike in HTTP 500 responses immediately following deployment v2.4.1.",
    detectedAt: "2026-10-28T21:40:00Z",
    activeRelease: "v2.4.1",
    stableRelease: "v2.4.0",
    status: "INVESTIGATING",
    metrics: [
      { time: "21:35", errorRate: 0.02, latencyP99: 120, cpuUsage: 24, memoryUsage: 45 },
      { time: "21:38", errorRate: 0.04, latencyP99: 125, cpuUsage: 26, memoryUsage: 46 },
      { time: "21:40", errorRate: 42.8, latencyP99: 3450, cpuUsage: 78, memoryUsage: 62 },
      { time: "21:42", errorRate: 44.1, latencyP99: 3620, cpuUsage: 82, memoryUsage: 64 },
      { time: "21:45", errorRate: 43.5, latencyP99: 3510, cpuUsage: 80, memoryUsage: 63 }
    ],
    healthyMetrics: [
      { time: "21:48", errorRate: 0.01, latencyP99: 115, cpuUsage: 23, memoryUsage: 44 },
      { time: "21:50", errorRate: 0.01, latencyP99: 110, cpuUsage: 22, memoryUsage: 43 }
    ],
    logs: [
      {
        id: "log-101",
        timestamp: "2026-10-28T21:40:12Z",
        level: "ERROR",
        service: "checkout-service",
        message: "Unhandled Exception processing cart checkout for customer_id: cus_98412",
        stackTrace: "java.lang.NullPointerException: Cannot invoke 'Coupon.getCode()' because the return value of 'CheckoutRequest.getCoupon()' is null\n\tat com.app.checkout.PaymentGatewayController.processOrder(PaymentGatewayController.java:142)\n\tat com.app.checkout.OrderDispatcher.dispatch(OrderDispatcher.java:88)"
      },
      {
        id: "log-102",
        timestamp: "2026-10-28T21:40:15Z",
        level: "ERROR",
        service: "checkout-service",
        message: "Unhandled Exception processing cart checkout for customer_id: cus_98415",
        stackTrace: "java.lang.NullPointerException: Cannot invoke 'Coupon.getCode()' because the return value of 'CheckoutRequest.getCoupon()' is null\n\tat com.app.checkout.PaymentGatewayController.processOrder(PaymentGatewayController.java:142)"
      },
      {
        id: "log-103",
        timestamp: "2026-10-28T21:39:55Z",
        level: "INFO",
        service: "checkout-service",
        message: "Deployment v2.4.1 activated across 8 pods in cluster us-east-prod"
      },
      {
        id: "log-104",
        timestamp: "2026-10-28T21:41:02Z",
        level: "WARN",
        service: "checkout-service",
        message: "Circuit breaker TRIPPED for downstream payment gateway (error threshold exceeded 30%)"
      }
    ],
    deployments: [
      {
        releaseId: "v2.4.1",
        commitHash: "a7e89f2",
        author: "Alex Rivera <alex@company.internal>",
        timestamp: "2026-10-28T21:38:00Z",
        service: "checkout-service",
        summary: "feat(checkout): add promotional coupon auto-apply on cart payload",
        diff: `--- a/src/main/java/com/app/checkout/PaymentGatewayController.java
+++ b/src/main/java/com/app/checkout/PaymentGatewayController.java
@@ -139,7 +139,7 @@ public class PaymentGatewayController {
     public OrderResult processOrder(CheckoutRequest request) {
-        String coupon = request.getCoupon() != null ? request.getCoupon().getCode() : "NONE";
+        String coupon = request.getCoupon().getCode(); // BUG: Unchecked null dereference when coupon omitted!
         PaymentIntent intent = paymentService.createIntent(request.getAmount(), coupon);
         return orderDispatcher.dispatch(intent);
     }`,
        isStable: false
      },
      {
        releaseId: "v2.4.0",
        commitHash: "3b91c10",
        author: "Jordan Lee <jordan@company.internal>",
        timestamp: "2026-10-27T14:15:00Z",
        service: "checkout-service",
        summary: "chore(deps): update spring-boot framework patch version",
        diff: `// Stable deployment artifact: build-hash #7842`,
        isStable: true
      }
    ],
    featureFlags: [
      {
        id: "FF_CHECKOUT_PROMO",
        name: "Auto-apply promotional discounts",
        description: "Enables new client-side discount coupon evaluation during checkout",
        enabled: true,
        service: "checkout-service"
      }
    ],
    requiredActions: [
      {
        actionId: "rollbackDeployment",
        expectedParams: { releaseId: "v2.4.0" },
        explanation: "Revert checkout-service to the last known stable release v2.4.0 to stop NullPointerExceptions."
      }
    ],
    postMortemTemplate: {
      rootCause: "Unchecked dereference on optional coupon field in PaymentGatewayController.java line 142 introduced in commit a7e89f2.",
      trigger: "Deployment of v2.4.1 to production cluster without null-safe unit test coverage for customers without coupons.",
      blastRadius: "Checkout API experienced 42.8% error rate affecting approximately 1,420 checkout attempts over 8 minutes.",
      recommendedPrevention: "Implement mandatory static analysis check (SpotBugs/NullAway) in CI pipeline and enforce unit test cases with null coupon payloads."
    }
  },
  {
    id: "inc-4402",
    title: "Session CrashLoop: Java Heap OOMKilled in session-auth-service",
    severity: "HIGH",
    service: "session-auth-service",
    description: "Authentication & user session service pods restarting continuously due to JVM heap exhaustion (exit code 137).",
    detectedAt: "2026-10-28T20:15:00Z",
    activeRelease: "v3.1.0",
    stableRelease: "v3.0.4",
    status: "INVESTIGATING",
    metrics: [
      { time: "20:05", errorRate: 0.1, latencyP99: 45, cpuUsage: 35, memoryUsage: 48 },
      { time: "20:10", errorRate: 0.5, latencyP99: 60, cpuUsage: 55, memoryUsage: 82 },
      { time: "20:15", errorRate: 28.4, latencyP99: 1850, cpuUsage: 96, memoryUsage: 99.2 },
      { time: "20:20", errorRate: 31.2, latencyP99: 2100, cpuUsage: 98, memoryUsage: 99.8 }
    ],
    healthyMetrics: [
      { time: "20:25", errorRate: 0.05, latencyP99: 42, cpuUsage: 32, memoryUsage: 46 }
    ],
    logs: [
      {
        id: "log-201",
        timestamp: "2026-10-28T20:14:48Z",
        level: "ERROR",
        service: "session-auth-service",
        message: "java.lang.OutOfMemoryError: Java heap space",
        stackTrace: "java.lang.OutOfMemoryError: Java heap space\n\tat java.base/util/concurrent/ConcurrentHashMap.putVal(ConcurrentHashMap.java:1012)\n\tat com.app.session.LocalCacheAdapter.store(LocalCacheAdapter.java:54)"
      },
      {
        id: "log-202",
        timestamp: "2026-10-28T20:15:01Z",
        level: "WARN",
        service: "session-auth-service",
        message: "Kubernetes pod session-auth-7d9f8-x4b2 terminated with reason: OOMKilled (exit code 137, restarts: 6)"
      }
    ],
    deployments: [
      {
        releaseId: "v3.1.0",
        commitHash: "c310bb4",
        author: "Devin Taylor <devin@company.internal>",
        timestamp: "2026-10-28T19:50:00Z",
        service: "session-auth-service",
        summary: "perf(session): add local in-memory fallback cache for auth tokens",
        diff: `--- a/src/main/java/com/app/session/LocalCacheAdapter.java
+++ b/src/main/java/com/app/session/LocalCacheAdapter.java
@@ -23,6 +23,8 @@ public class LocalCacheAdapter {
+    // Unbounded local cache with no TTL or LRU eviction
+    private static final Map<String, UserSession> LOCAL_CACHE = new ConcurrentHashMap<>();
+    public void store(String token, UserSession session) {
+        LOCAL_CACHE.put(token, session); // Leaks memory on every auth handshake!
+    }`,
        isStable: false
      }
    ],
    featureFlags: [
      {
        id: "FF_UNBOUNDED_SESSION_CACHE",
        name: "Local In-Memory Session Cache",
        description: "Bypasses Redis network hop by caching active user tokens in pod heap memory",
        enabled: true,
        service: "session-auth-service"
      }
    ],
    requiredActions: [
      {
        actionId: "toggleFeatureFlag",
        expectedParams: { flagId: "FF_UNBOUNDED_SESSION_CACHE", enabled: false },
        explanation: "Disable the unbounded local in-memory session cache flag to prevent heap leak."
      },
      {
        actionId: "restartService",
        expectedParams: { service: "session-auth-service" },
        explanation: "Cycle pod replicas to clear saturated JVM heap memory."
      }
    ],
    postMortemTemplate: {
      rootCause: "Unbounded ConcurrentHashMap in LocalCacheAdapter.java accumulating session tokens without TTL eviction policy.",
      trigger: "Enabling FF_UNBOUNDED_SESSION_CACHE in production without heap sizing benchmarks.",
      blastRadius: "Authentication latency degraded for 10 minutes, resulting in intermittent session drops.",
      recommendedPrevention: "Enforce Guava or Caffeine cache with strict maximumSize and expireAfterWrite bounds."
    }
  },
  {
    id: "inc-7119",
    title: "Connection Exhaustion: Database Pool Saturated in analytics-service",
    severity: "HIGH",
    service: "postgres-analytics-service",
    description: "Postgres database connection pool saturated at 100/100 connections; client queries failing with HTTP 504.",
    detectedAt: "2026-10-28T18:30:00Z",
    activeRelease: "v1.9.4",
    stableRelease: "v1.9.3",
    status: "INVESTIGATING",
    metrics: [
      { time: "18:20", errorRate: 0.05, latencyP99: 40, cpuUsage: 30, memoryUsage: 50, activeConnections: 18 },
      { time: "18:25", errorRate: 2.1, latencyP99: 450, cpuUsage: 65, memoryUsage: 65, activeConnections: 64 },
      { time: "18:30", errorRate: 36.7, latencyP99: 12400, cpuUsage: 99, memoryUsage: 85, activeConnections: 100 },
      { time: "18:35", errorRate: 38.2, latencyP99: 13200, cpuUsage: 100, memoryUsage: 86, activeConnections: 100 }
    ],
    healthyMetrics: [
      { time: "18:40", errorRate: 0.02, latencyP99: 38, cpuUsage: 28, memoryUsage: 48, activeConnections: 16 }
    ],
    logs: [
      {
        id: "log-301",
        timestamp: "2026-10-28T18:30:04Z",
        level: "ERROR",
        service: "postgres-analytics-service",
        message: "FATAL: remaining connection slots are reserved for non-replication superuser connections (state: 53300)",
        stackTrace: "org.postgresql.util.PSQLException: FATAL: remaining connection slots are reserved\n\tat com.app.analytics.QueryExecutor.getConnection(QueryExecutor.ts:42)"
      },
      {
        id: "log-302",
        timestamp: "2026-10-28T18:30:15Z",
        level: "ERROR",
        service: "postgres-analytics-service",
        message: "HikariPool-1 - Connection is not available, request timed out after 30005ms"
      }
    ],
    deployments: [
      {
        releaseId: "v1.9.4",
        commitHash: "f891d29",
        author: "Sarah Chen <sarah@company.internal>",
        timestamp: "2026-10-28T18:15:00Z",
        service: "postgres-analytics-service",
        summary: "feat(analytics): add asynchronous user telemetry cohort query",
        diff: `--- a/src/analytics/QueryExecutor.ts
+++ b/src/analytics/QueryExecutor.ts
@@ -38,6 +38,8 @@ export class QueryExecutor {
     async runCohortQuery(cohortId: string) {
         const client = await pool.connect();
+        // BUG: Query error does not call client.release()!
+        const res = await client.query('SELECT * FROM large_cohort_events WHERE cohort_id = $1', [cohortId]);
+        return res.rows;
     }`,
        isStable: false
      }
    ],
    featureFlags: [
      {
        id: "FF_ASYNC_ANALYTICS_V2",
        name: "Async Cohort Analytics v2",
        description: "Streams cohort analytics queries to Postgres connection pool",
        enabled: true,
        service: "postgres-analytics-service"
      }
    ],
    requiredActions: [
      {
        actionId: "toggleFeatureFlag",
        expectedParams: { flagId: "FF_ASYNC_ANALYTICS_V2", enabled: false },
        explanation: "Disable the leaking async cohort analytics feature flag to stop connection pool leaks."
      }
    ],
    postMortemTemplate: {
      rootCause: "Unreleased database pool client on cohort query error paths in QueryExecutor.ts leading to rapid connection pool saturation.",
      trigger: "Enabling FF_ASYNC_ANALYTICS_V2 which triggered cohort aggregations.",
      blastRadius: "Analytics dashboard and reporting APIs timed out with HTTP 504 for 25 minutes.",
      recommendedPrevention: "Enforce automatic resource cleanup using try-finally or pooled query helper wrappers that auto-release connections."
    }
  }
];
