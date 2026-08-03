import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { GoalzenRoot } from "../goalzen/GoalzenRoot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Goalzen — Live Sports Streams, Scores & Highlights" },
      {
        name: "description",
        content:
          "Watch live football, cricket and sports streams on Goalzen with real-time scores, schedules, sports channels and match highlights.",
      },
      { property: "og:title", content: "Goalzen — Live Sports Streams, Scores & Highlights" },
      {
        property: "og:description",
        content:
          "Watch live football, cricket and sports streams on Goalzen with real-time scores, schedules, sports channels and match highlights.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div id="sports-loader">FETCHING DATA...</div>}>
      <GoalzenRoot />
    </ClientOnly>
  );
}
