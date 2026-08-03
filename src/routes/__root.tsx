import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Goalzen — Live Sports Streams, Scores & Highlights" },
      {
        name: "keywords",
        content:
          "Goalzen, live sports streams, IPL live streaming, La Liga live, Premier League stream, live football match, cricket live streams, Goalzen live sports, watch football free, UEFA Champions League live",
      },
      {
        name: "description",
        content: "Goalzen brings you free live sports streams — Premier League, La Liga, UEFA Champions League, IPL cricket and more — with real-time scores, schedules, sports channels and instant match highlights.",
      },
      { property: "og:title", content: "Goalzen — Live Sports Streams, Scores & Highlights" },
      {
        property: "og:description",
        content: "Goalzen brings you free live sports streams — Premier League, La Liga, UEFA Champions League, IPL cricket and more — with real-time scores, schedules, sports channels and instant match highlights.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Goalzen" },
      { property: "og:url", content: "https://www.goalzen.site" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Goalzen — Live Sports Streams, Scores & Highlights" },
      { name: "twitter:description", content: "Goalzen brings you free live sports streams — Premier League, La Liga, UEFA Champions League, IPL cricket and more — with real-time scores, schedules, sports channels and instant match highlights." },
      { property: "og:image", content: "https://i.ibb.co/1Yh8PdLH/1000459066.png" },
      { name: "twitter:image", content: "https://i.ibb.co/1Yh8PdLH/1000459066.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;600;700;800;900&display=swap",
      },
      { rel: "icon", href: "https://i.ibb.co/1Yh8PdLH/1000459066.png", type: "image/png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
