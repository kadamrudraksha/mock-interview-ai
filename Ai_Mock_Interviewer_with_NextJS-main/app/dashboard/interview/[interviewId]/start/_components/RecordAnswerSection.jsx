"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  // Optionally accept a callback to notify parent when answer auto-save occurs
  onAutoSave,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText, setResults } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Keep previous question index to know when question changes
  const prevQuestionIndexRef = useRef(activeQuestionIndex);

  // Capture latest answer for use in async cleanup
  const userAnswerRef = useRef(userAnswer);
  userAnswerRef.current = userAnswer;
  const isRecordingRef = useRef(isRecording);
  isRecordingRef.current = isRecording;

  // Update user answer from speech results
  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  // Enhanced JSON parsing with better error handling
  const parseAIResponse = (responseText) => {
    try {
      let cleaned = responseText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch);
      }
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.log('Original response:', responseText);
      return {
        rating: "5/10",
        feedback: "Unable to generate detailed feedback due to parsing error. Please try again."
      };
    }
  };

  const UpdateUserAnswer = async (force) => {
    // Don't save empty/very short answers unless forced
    if (!userAnswerRef.current || userAnswerRef.current.trim().length < 10) {
      if (force) {
        toast.error("Answer too short. Not saved.");
      }
      return;
    }
    setLoading(true);
    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[prevQuestionIndexRef.current]?.question}

User Answer: ${userAnswerRef.current}

Based on the interview question and the user's answer, please provide:
1. A rating out of 10 (format: "X/10")
2. Constructive feedback in 3-5 lines highlighting strengths and areas for improvement

Return the response in valid JSON format with exactly these two fields:
{
  "rating": "7/10",
  "feedback": "Your specific feedback here"
}`;
      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      const JsonfeedbackResp = parseAIResponse(responseText);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[prevQuestionIndexRef.current]?.question,
        correctAns: mockInterviewQuestion[prevQuestionIndexRef.current]?.answer,
        userAns: userAnswerRef.current,
        feedback: JsonfeedbackResp?.feedback,
        rating: JsonfeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });
      if (resp) {
        toast.success("Answer recorded and feedback generated successfully!");
        setUserAnswer("");
        setResults([]);
        if (onAutoSave) onAutoSave();
      } else {
        toast.error("Failed to save answer to database");
      }
    } catch (error) {
      console.error("❌ Error saving user answer:", error);
      toast.error("Failed to save answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      setIsProcessing(true);

      if (userAnswer?.length < 10) {
        setLoading(false);
        setIsProcessing(false);
        toast.error("Answer too short. Please record a more detailed answer.");
        return;
      }
      await UpdateUserAnswer();
      setIsProcessing(false);
    } else {
      setUserAnswer("");
      setResults([]);
      startSpeechToText();
    }
  };

  // AUTO-SAVE ON QUESTION CHANGE OR UNMOUNT
  useEffect(() => {
    return () => {
      // Only auto-save if currently recording and answer is not empty
      if (isRecordingRef.current && userAnswerRef.current.length > 0) {
        stopSpeechToText();
        UpdateUserAnswer(true);
      }
    };
    // Triggers when activeQuestionIndex changes or component unmounts
  }, [activeQuestionIndex]);

  // Update previous question index ref for correct association
  useEffect(() => {
    prevQuestionIndexRef.current = activeQuestionIndex;
  }, [activeQuestionIndex]);

  // Show error message if Speech API is not available
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-yellow-800 mb-2">
            🎤 Web Speech API is not available in this browser
          </p>
          <p className="text-sm text-yellow-700">
            Please use <strong>Google Chrome</strong> and allow microphone permissions for voice recording.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      {/* Webcam Section - Compact */}
      <div className="relative bg-black rounded-lg p-4 mb-6 flex-shrink-0">
        <Image
          src={"/webcam.png"}
          width={120}
          height={120}
          className="absolute inset-0 m-auto"
          alt="webcam"
          priority
        />
        <Webcam
          style={{
            height: 200,
            width: 300,
            zIndex: 10,
            borderRadius: "8px"
          }}
          mirrored={true}
          onUserMedia={() => setWebcamEnabled(true)}
          onUserMediaError={() => setWebcamEnabled(false)}
        />
      </div>

      {/* Webcam Status - Compact */}
      {!webcamEnabled && (
        <div className="mb-3 text-center">
          <p className="text-xs text-gray-600">
            Please allow camera access
          </p>
        </div>
      )}

      {/* Recording Status - Compact */}
      {isRecording && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full max-w-md">
          <p className="text-red-800 text-center text-sm font-semibold">
            🔴 Recording... Speak clearly
          </p>
        </div>
      )}

      {/* Real-time transcript preview - Scrollable */}
      {(isRecording || userAnswer) && (
        <div className="mb-4 p-3 bg-gray-50 border rounded-lg w-full max-w-md flex-shrink-0">
          <p className="text-xs font-semibold mb-2">Current Answer:</p>
          <div className="max-h-20 overflow-y-auto">
            <p className="text-xs text-gray-700">
              {userAnswer + (interimResult || "")}
            </p>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Length: {userAnswer.length} chars
          </div>
        </div>
      )}

      {/* Record Button - Fixed position */}
      <div className="flex flex-col items-center gap-3 flex-shrink-0">
        <Button
          disabled={loading || isProcessing}
          variant="outline"
          size="lg"
          onClick={StartStopRecording}
          className="min-w-[200px]"
        >
          {loading || isProcessing ? (
            <span className="text-blue-600 items-center flex gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              {isProcessing ? "Processing..." : "Saving..."}
            </span>
          ) : isRecording ? (
            <span className="text-red-600 items-center animate-pulse flex gap-2">
              <StopCircle /> Stop Recording
            </span>
          ) : (
            <span className="text-primary flex gap-2 items-center">
              <Mic /> Record Answer
            </span>
          )}
        </Button>
        {/* Debug Button - Smaller */}
        {process.env.NODE_ENV === 'development' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Current answer:", userAnswer)}
            className="text-xs"
          >
            Debug: Show Answer
          </Button>
        )}
      </div>

      {/* Instructions - Compact */}
      <div className="mt-4 text-center text-xs text-gray-600 max-w-md flex-shrink-0">
        <p>
          Click "Record Answer" → Speak → Click "Stop Recording"
          <br />
          Answer will be automatically saved and evaluated.
        </p>
      </div>
    </div>
  );
};

export default RecordAnswerSection;
