import { GoalzenProvider } from "./store";
import { GoalzenApp } from "./GoalzenApp";
import "./goalzen.base.css";
import "./goalzen.css";

/** Root wrapper: mounts the global store provider around the Goalzen SPA. */
export function GoalzenRoot() {
  return (
    <GoalzenProvider>
      <GoalzenApp />
    </GoalzenProvider>
  );
}
