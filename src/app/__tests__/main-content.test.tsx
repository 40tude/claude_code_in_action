import { test, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MainContent } from "../main-content";

vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: any) => <div>{children}</div>,
  useFileSystem: vi.fn(() => ({
    getAllFiles: vi.fn(() => new Map()),
    refreshTrigger: 0,
  })),
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: any) => <div>{children}</div>,
  useChat: vi.fn(() => ({
    messages: [],
    input: "",
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
    status: "idle",
  })),
}));

vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface">Chat</div>,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree">FileTree</div>,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor">CodeEditor</div>,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame">PreviewFrame</div>,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions">HeaderActions</div>,
}));

vi.mock("@/components/ui/resizable", () => ({
  ResizablePanelGroup: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  ResizablePanel: ({ children }: any) => <div>{children}</div>,
  ResizableHandle: () => <div />,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

test("renders with Preview tab active by default", () => {
  render(<MainContent />);

  const previewButton = screen.getByText("Preview");
  const codeButton = screen.getByText("Code");

  expect(previewButton.className).toContain("text-neutral-900");
  expect(codeButton.className).toContain("text-neutral-600");
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("switches to code view when Code button is clicked", () => {
  render(<MainContent />);

  const codeButton = screen.getByText("Code");
  fireEvent.mouseDown(codeButton);

  expect(screen.getByTestId("code-editor")).toBeDefined();
  expect(screen.getByTestId("file-tree")).toBeDefined();
  expect(screen.queryByTestId("preview-frame")).toBeNull();
});

test("switches back to preview view when Preview button is clicked after Code", () => {
  render(<MainContent />);

  const codeButton = screen.getByText("Code");
  fireEvent.mouseDown(codeButton);

  expect(screen.queryByTestId("preview-frame")).toBeNull();

  const previewButton = screen.getByText("Preview");
  fireEvent.mouseDown(previewButton);

  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("Code button shows active styling when code view is active", () => {
  render(<MainContent />);

  const codeButton = screen.getByText("Code");
  fireEvent.mouseDown(codeButton);

  expect(codeButton.className).toContain("text-neutral-900");
  expect(screen.getByText("Preview").className).toContain("text-neutral-600");
});

test("tab buttons respond to mousedown not just click", () => {
  render(<MainContent />);

  const codeButton = screen.getByText("Code");

  // Simulate only mousedown (not a full click) - should still toggle
  fireEvent.mouseDown(codeButton);

  expect(screen.getByTestId("code-editor")).toBeDefined();
});
