import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function CodeSnippet({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative bg-secondary-600 text-sm rounded-xl p-4 font-mono shadow-md overflow-x-auto border border-base-300">
      <pre className="whitespace-pre-wrap text-primary">{code}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 tooltip tooltip-left"
        data-tip={copied ? "Copied!" : "Copy"}
      >
        {copied ? (
          <FiCheck className="text-success w-5 h-5" />
        ) : (
          <FiCopy className="w-5 h-5 text-base-content/80 hover:text-primary" />
        )}
      </button>
    </div>
  );
}

