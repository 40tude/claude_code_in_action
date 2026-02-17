import { Loader2 } from "lucide-react";

interface ToolCallStatusProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

export function getStatusMessage(
  toolName: string,
  args: Record<string, unknown>,
  state: string
): string {
  const done = state === "result";
  const path = (args?.path as string) || "file";

  if (toolName === "str_replace_editor") {
    const command = args?.command as string;
    switch (command) {
      case "create":
        return done ? `Created ${path}` : `Creating ${path}...`;
      case "str_replace":
        return done ? `Edited ${path}` : `Editing ${path}...`;
      case "insert":
        return done ? `Inserted into ${path}` : `Inserting into ${path}...`;
      case "view":
        return done ? `Viewed ${path}` : `Viewing ${path}...`;
      case "undo_edit":
        return done ? `Reverted ${path}` : `Reverting ${path}...`;
    }
  }

  if (toolName === "file_manager") {
    const command = args?.command as string;
    if (command === "rename") {
      const newPath = args?.new_path as string;
      return done
        ? `Renamed ${path} to ${newPath || "new location"}`
        : `Renaming ${path}...`;
    }
    if (command === "delete") {
      return done ? `Deleted ${path}` : `Deleting ${path}...`;
    }
  }

  return done ? toolName : `Running ${toolName}...`;
}

export function ToolCallStatus({ toolName, args, state, result }: ToolCallStatusProps) {
  const message = getStatusMessage(toolName, args, state);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {state === "result" && result ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
