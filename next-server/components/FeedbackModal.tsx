"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeedbackModalProps {
  feedback: string | null;
  isVisible: boolean;
  currentQuestion: string;
  error?: string | null;
}

export function FeedbackModal({ feedback, isVisible, currentQuestion, error }: FeedbackModalProps) {
  return (
    <div className="fixed right-8 top-24 w-96 z-50">
      <Card className="shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isVisible ? (
              <>
                {currentQuestion && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Current Question:</p>
                    <p className="text-sm text-gray-600">{currentQuestion}</p>
                  </div>
                )}
                {error ? (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                ) : feedback ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{feedback}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Waiting for your response...
                  </p>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-400 text-center py-8">
                <p>Start your interview to receive real-time feedback on your responses.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
