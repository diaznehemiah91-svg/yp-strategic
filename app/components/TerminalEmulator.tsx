'use client';

import { useState, useRef, useEffect } from 'react';
import { executeCommand } from '@/app/lib/terminal-commands';

interface OutputLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'info' | 'clear';
  text: string;
}

const AVAILABLE_COMMANDS = [
  '/scan --sector [AI|DEFENCE|CYBER|QUANTUM] --price-range [min]-[max]',
  '/analyze --ticker [TICKER] --depth [quick|full]',
  '/alert --ticker [TICKER] --price-above|below [VALUE]',
  '/signals --severity [CRITICAL|ALERT|INFO] --category [DEFENCE|AI|CYBER]',
  '/watchlist --add|remove [TICKER1,TICKER2...]',
  '/export --format [csv|json] --tickers [TICKER1,TICKER2...]',
  '/sentiment --ticker [TICKER]',
  '/news --ticker [TICKER] --days [1-30]',
  '/trends --sector [AI|DEFENCE|CYBER]',
  '/help',
  '/clear',
];

export default function TerminalEmulator() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<OutputLine[]>([
    {
      id: '0',
      type: 'info',
      text: '🔌 Y.P Strategic Research Terminal • Connected',
    },
    {
      id: '1',
      type: 'info',
      text: 'Type /help to see available commands',
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle autocomplete
  const handleInputChange = (e: string) => {
    setCommand(e);
    setHistoryIndex(-1);

    if (e.startsWith('/')) {
      const matching = AVAILABLE_COMMANDS.filter(cmd => cmd.startsWith(e.split(' ')[0]));
      setSuggestions(matching);
    } else {
      setSuggestions([]);
    }
  };

  // Handle command execution
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add to history
    setHistory([...history, trimmedCommand]);
    setHistoryIndex(-1);

    // Add command to output
    const commandId = `cmd_${Date.now()}`;
    setOutput(prev => [
      ...prev,
      {
        id: commandId,
        type: 'command',
        text: `$ ${trimmedCommand}`,
      },
    ]);

    setCommand('');
    setSuggestions([]);
    setIsLoading(true);

    try {
      const result = await executeCommand(trimmedCommand);

      if (result.type === 'clear') {
        setOutput([
          {
            id: `${Date.now()}`,
            type: 'info',
            text: '🔌 Terminal cleared',
          },
        ]);
      } else {
        setOutput(prev => [
          ...prev,
          {
            id: `out_${Date.now()}`,
            type: result.type,
            text: result.text,
          },
        ]);
      }
    } catch (error) {
      setOutput(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          type: 'error',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle keyboard navigation (up/down through history)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' && history.length > 0) {
      e.preventDefault();
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setCommand(history[newIndex]);
      setSuggestions([]);
    } else if (e.key === 'ArrowDown' && history.length > 0) {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setCommand('');
      } else {
        setHistoryIndex(newIndex);
        setCommand(history[newIndex]);
      }
      setSuggestions([]);
    } else if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setCommand(suggestions[0].split(' ')[0]);
      setSuggestions([]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      {/* Output Area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 border-b border-[rgba(0,255,80,0.12)]"
      >
        {output.map(line => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap break-words ${
              line.type === 'command'
                ? 'text-[var(--accent)] font-bold'
                : line.type === 'error'
                  ? 'text-[var(--accent3)]'
                  : line.type === 'info'
                    ? 'text-[var(--accent2)]'
                    : 'text-[var(--text-bright)]'
            }`}
          >
            {line.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-[var(--accent)] animate-pulse">
            ▍ Processing...
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 bg-[rgba(0,255,80,0.05)] border-b border-[rgba(0,255,80,0.12)]">
          <p className="text-[10px] text-[var(--text-dim)] mb-1">Suggestions (Tab to use):</p>
          <div className="space-y-0.5">
            {suggestions.slice(0, 3).map((s, i) => (
              <div key={i} className="text-[11px] text-[var(--accent2)] ml-2">
                → {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[rgba(0,255,80,0.12)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent)] font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Type command... (/help for list)"
            className="flex-1 bg-transparent font-mono text-sm text-[var(--text-bright)] placeholder-[var(--text-dim)] outline-none"
            autoComplete="off"
          />
        </div>
        {!command && (
          <p className="text-[9px] text-[var(--text-dim)] mt-2 ml-6">
            Examples: /scan --sector AI • /analyze --ticker PLTR • /signals --severity CRITICAL
          </p>
        )}
      </form>
    </div>
  );
}
