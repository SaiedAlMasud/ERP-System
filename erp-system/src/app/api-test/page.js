"use client";

import { useEffect, useState } from "react";
import apiRequest from "@/lib/api";

export default function ApiTestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await apiRequest("/health");

        setResult(response);
      } catch (error) {
        setError(error.message);
      }
    };

    testApi();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border p-6">
        <h1 className="mb-4 text-xl font-semibold">
          API Connection Test
        </h1>

        {result && (
          <pre>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}