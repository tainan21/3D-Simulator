import "./style.css";
import { AppShell } from "./app/shell";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Missing #app root");

new AppShell(root).mount();
