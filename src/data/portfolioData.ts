export interface Project {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  technologies: string[];
  externalUrl?: string;
  hasModal?: boolean;
  deepDive: {
    summary: string;
    flow?: string;
    highlights: string[];
    architecture?: string[];
  };
}

export const PORTFOLIO_DATA = {
  header: {
    name: "SOHAM SANGOLE",
    year: "2026",
  },
  hero: {
    title: "Software Engineer",
    subtitle: "Obsessed with simplicity, clarity, and building software that lasts.",
    location: "Mumbai, India",
    status: "Currently building",
  },
  projects: [
    {
      id: "payment-platform",
      number: "01",
      title: "Payment Processing & Fraud Detection Platform",
      shortDescription: "A simulated payment platform focused on reliable, auditable, and resilient payment workflows.",
      technologies: ["Kotlin", "Spring Boot", "PostgreSQL", "Redis", "Kafka"],
      externalUrl: "https://github.com/sohamsangole/payment-processing-engine",
      hasModal: true,
      deepDive: {
        summary: "A robust financial transaction core designed to process high-throughput payments with zero data loss, real-time risk evaluation, and exact-once settlement guarantees.",
        highlights: [
          "Payment lifecycle state machine (Authorized, Captured, Settled, Refunded, Failed)",
          "Idempotency keys with Redis distributed locks preventing duplicate transactions",
          "Automated exponential backoff retries and dead-letter queue (DLQ) processing",
          "Rule-based and heuristic fraud scoring pipeline before payment gateway dispatch",
          "Daily settlement reconciliation engine matching ledger entries against gateway logs"
        ]
      }
    },
    {
      id: "stella",
      number: "02",
      title: "Stella",
      shortDescription: "A self-hosted AI software engineer that turns GitHub issues into tested pull requests.",
      technologies: ["Python", "FastAPI", "Celery", "Redis", "GitHub"],
      externalUrl: "https://github.com/sohamsangole/stella",
      hasModal: true,
      deepDive: {
        summary: "An autonomous agentic developer that hooks into GitHub webhooks, parses problem context, iterates on code changes in an isolated workspace, runs tests, and opens clean pull requests.",
        flow: "[PLAN] → [CODE] → [REVIEW] → [TEST] → [PR]",
        highlights: [
          "Event-driven state machine loop: PLAN → CODE → REVIEW → TEST → COMPLETED",
          "Automated feedback loops (review rejected or test failed routes back to PLAN with error tracebacks)",
          "Listens to GitHub issue events and repository webhooks with HMAC signature verification",
          "Orchestrates asynchronous agent tasks via Celery worker queues and Redis broker",
          "Automated patch generation, lint checking, and unit test execution inside isolated Git sandboxes"
        ]
      }
    }
  ] as Project[],
  experiences: [
    {
      company: "Bank of America",
      role: "Software Engineer 1",
      period: "Aug 2025 – Present",
      location: "Mumbai, India",
    },
    {
      company: "Thermax Limited",
      role: "Summer Intern",
      period: "Jun 2024 – Jul 2024",
      location: "Pune, India",
    }
  ],
  now: {
    title: "NOW",
    items: [
      "Learning Japanese",
      "Curating Spotify playlists",
      "Building interesting things",
    ],
  },
  footer: {
    links: [
      { name: "GITHUB", url: "https://github.com/sohamsangole" },
      { name: "LINKEDIN", url: "https://linkedin.com/in/sohamsangole" },
      { 
        name: "EMAIL", 
        url: "mailto:sasangole2019@gmail.com?subject=Hello%20Soham%20-%20Let's%20Connect&body=Hi%20Soham%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20wanted%20to%20reach%20out%20regarding%20...%0A%0ABest%2C" 
      },
      { name: "RESUME", url: "#resume" },
    ]
  }
};
