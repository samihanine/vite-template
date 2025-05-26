// src/components/HammingTester.tsx
import React, { useState } from 'react';
import { encode, decode } from '../utils/hamming';

/* utility --------------------------------------------------- */
function randomBits(n: number): string {
  return Array.from({ length: n }, () =>
    Math.random() < 0.5 ? '0' : '1',
  ).join('');
}

/* component ------------------------------------------------- */
export default function HammingTester() {
  /* UI state */
  const [msgLen, setMsgLen] = useState(7); // desired random length
  const [raw, setRaw] = useState(randomBits(msgLen)); // original message
  const [codeword, setCodeword] = useState(''); // encoded bits
  const [received, setReceived] = useState(''); // BEC output
  const [decoded, setDecoded] = useState(''); // after decode()
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  /* Encode -------------------------------------------------- */
  const handleEncode = () => {
    setCodeword(encode(raw));
    setReceived('');
    setDecoded('');
    setStatus('idle');
  };

  /* Decode -------------------------------------------------- */
  const handleDecode = () => {
    if (received.length !== codeword.length || !received) {
      setStatus('err');
      setDecoded('Length mismatch or empty input');
      return;
    }
    const dec = decode(received).slice(0, raw.length); // trim padding
    setDecoded(dec);
    setStatus(dec === raw ? 'ok' : 'err');
  };

  /* JSX ----------------------------------------------------- */
  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      {/* Raw input + Random */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Raw binary message
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={raw}
            onChange={(e) => setRaw(e.target.value.replace(/[^01]/g, ''))}
            className="flex-1 rounded-md border p-2"
          />
          <button
            onClick={() => {
              setRaw(randomBits(msgLen));
              setCodeword('');
              setReceived('');
              setDecoded('');
              setStatus('idle');
            }}
            className="rounded-md bg-gray-600 px-3 py-2 text-white transition hover:bg-gray-700"
          >
            Random
          </button>
        </div>
      </div>

      {/* Encode button */}
      <button
        onClick={handleEncode}
        className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        Encode
      </button>

      {/* Encoded output */}
      {codeword && (
        <div className="rounded-md bg-gray-100 p-3">
          <p className="text-sm font-semibold">
            Encoded codeword (copy to{' '}
            <a
              href="https://www.lorsmip.site/InformationTheory/bec.php?authuser=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Simulator
            </a>
            ):
          </p>
          <code className="break-words">{codeword}</code>
        </div>
      )}

      {/* Received string */}
      {codeword && (
        <div>
          <label className="mb-1 block text-sm font-medium">
            Paste simulator output (with “?”)
          </label>
          <input
            type="text"
            value={received}
            onChange={(e) => setReceived(e.target.value.replace(/[^01?]/g, ''))}
            className="w-full rounded-md border p-2"
          />
        </div>
      )}

      {/* Decode button */}
      {codeword && (
        <button
          onClick={handleDecode}
          className="rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
        >
          Decode
        </button>
      )}

      {/* Results */}
      {decoded && (
        <div
          className={`rounded-md p-4 ${
            status === 'ok' ? 'bg-emerald-100' : 'bg-red-100'
          }`}
        >
          <p className="text-sm font-semibold">Decoded result:</p>
          <code className="break-words">{decoded}</code>

          <p className="mt-2 text-sm">
            {status === 'ok' ? '✅ Success – message recovered' : '❌ Mismatch'}
          </p>
        </div>
      )}
    </div>
  );
}
