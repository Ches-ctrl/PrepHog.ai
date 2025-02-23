'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VideoEasterEgg() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:opacity-75 transition-opacity"
        aria-label="Easter egg"
      >
        <Image
          src="/hogbert-engineers.png"
          alt="Hogbert Engineers"
          width={32}
          height={32}
          className="rounded-full"
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full mx-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h3 className="text-lg font-medium text-center mb-4">Hogbert got the job! Better let his friends know.</h3>
            <video
              className="w-full rounded-lg"
              controls
              autoPlay
              src="/hogbert-gets-to-work.mp4"
            />
          </div>
        </div>
      )}
    </>
  );
}
