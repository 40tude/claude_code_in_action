import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallStatus, getStatusMessage } from "../ToolCallStatus";

afterEach(() => {
  cleanup();
});

// -- getStatusMessage unit tests --

test("str_replace_editor create: in-progress message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "create", path: "/App.tsx" }, "call")
  ).toBe("Creating /App.tsx...");
});

test("str_replace_editor create: done message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "create", path: "/App.tsx" }, "result")
  ).toBe("Created /App.tsx");
});

test("str_replace_editor str_replace: in-progress message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "str_replace", path: "/utils.ts" }, "call")
  ).toBe("Editing /utils.ts...");
});

test("str_replace_editor str_replace: done message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "str_replace", path: "/utils.ts" }, "result")
  ).toBe("Edited /utils.ts");
});

test("str_replace_editor insert: in-progress message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "insert", path: "/index.tsx" }, "call")
  ).toBe("Inserting into /index.tsx...");
});

test("str_replace_editor insert: done message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "insert", path: "/index.tsx" }, "result")
  ).toBe("Inserted into /index.tsx");
});

test("str_replace_editor view: in-progress message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "view", path: "/App.tsx" }, "call")
  ).toBe("Viewing /App.tsx...");
});

test("str_replace_editor view: done message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "view", path: "/App.tsx" }, "result")
  ).toBe("Viewed /App.tsx");
});

test("str_replace_editor undo_edit: in-progress message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "undo_edit", path: "/App.tsx" }, "call")
  ).toBe("Reverting /App.tsx...");
});

test("str_replace_editor undo_edit: done message", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "undo_edit", path: "/App.tsx" }, "result")
  ).toBe("Reverted /App.tsx");
});

test("file_manager rename: in-progress message", () => {
  expect(
    getStatusMessage("file_manager", { command: "rename", path: "/old.tsx", new_path: "/new.tsx" }, "call")
  ).toBe("Renaming /old.tsx...");
});

test("file_manager rename: done message", () => {
  expect(
    getStatusMessage("file_manager", { command: "rename", path: "/old.tsx", new_path: "/new.tsx" }, "result")
  ).toBe("Renamed /old.tsx to /new.tsx");
});

test("file_manager delete: in-progress message", () => {
  expect(
    getStatusMessage("file_manager", { command: "delete", path: "/temp.tsx" }, "call")
  ).toBe("Deleting /temp.tsx...");
});

test("file_manager delete: done message", () => {
  expect(
    getStatusMessage("file_manager", { command: "delete", path: "/temp.tsx" }, "result")
  ).toBe("Deleted /temp.tsx");
});

test("unknown tool: in-progress message", () => {
  expect(
    getStatusMessage("some_tool", {}, "call")
  ).toBe("Running some_tool...");
});

test("unknown tool: done message", () => {
  expect(
    getStatusMessage("some_tool", {}, "result")
  ).toBe("some_tool");
});

test("missing path falls back to 'file'", () => {
  expect(
    getStatusMessage("str_replace_editor", { command: "create" }, "call")
  ).toBe("Creating file...");
});

// -- Component render tests --

test("renders spinner when state is not result", () => {
  const { container } = render(
    <ToolCallStatus toolName="str_replace_editor" args={{ command: "create", path: "/App.tsx" }} state="call" />
  );

  expect(screen.getByText("Creating /App.tsx...")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("renders green dot when state is result", () => {
  const { container } = render(
    <ToolCallStatus toolName="str_replace_editor" args={{ command: "create", path: "/App.tsx" }} state="result" result="Success" />
  );

  expect(screen.getByText("Created /App.tsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
