'use client';

import { useState } from 'react';
import { UserPreferences } from '../types';

interface PreferencesModalProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function PreferencesModal({ preferences, onSave, isOpen, onClose }: PreferencesModalProps) {
  const [formData, setFormData] = useState<UserPreferences>(preferences);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Weather Preferences</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cold Weather Threshold: {formData.coldThreshold}°C
            </label>
            <input
              type="range"
              min="-10"
              max="20"
              step="1"
              value={formData.coldThreshold}
              onChange={(e) => setFormData({
                ...formData,
                coldThreshold: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-10°C</span>
              <span>20°C</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warm Weather Threshold: {formData.warmThreshold}°C
            </label>
            <input
              type="range"
              min="15"
              max="35"
              step="1"
              value={formData.warmThreshold}
              onChange={(e) => setFormData({
                ...formData,
                warmThreshold: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>15°C</span>
              <span>35°C</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rain Threshold: {formData.rainThreshold}mm/h
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={formData.rainThreshold}
              onChange={(e) => setFormData({
                ...formData,
                rainThreshold: parseFloat(e.target.value)
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0mm</span>
              <span>5mm</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wind Threshold: {formData.windThreshold} m/s
            </label>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={formData.windThreshold}
              onChange={(e) => setFormData({
                ...formData,
                windThreshold: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 m/s</span>
              <span>25 m/s</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}