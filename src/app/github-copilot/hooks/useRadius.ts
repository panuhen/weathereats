"use client";

// Hook for managing search radius
import { useState } from 'react';

export function useRadius() {
  const [radius, setRadius] = useState<number>(3); // Default 3km
  return [radius, setRadius] as const;
}
