import React from 'react';

const HowItWorksPage = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen max-h-screen overflow-hidden flex flex-col p-6 sm:p-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-900 mb-4 sm:mb-6 flex-shrink-0">
        How It Works
      </h1>
      <p className="text-center text-base sm:text-lg text-indigo-700 max-w-3xl mx-auto mb-6 sm:mb-10 flex-shrink-0">
        Welcome to the AI Mock Interviewer! Here’s a simple guide on how to get the most out of our platform.
      </p>

      <div className="flex-1 overflow-y-auto space-y-6 max-w-4xl mx-auto w-full">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center space-x-3 text-indigo-800 mb-2">
            <span className="text-indigo-500 text-2xl sm:text-3xl">📝</span>
            <span>Step 1: Start a New Interview</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Navigate to the dashboard and click on <span className="font-medium text-indigo-600">"Add New Interview"</span>. Fill in the details about the job role, your years of experience, and the tech stack to get tailored questions.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center space-x-3 text-indigo-800 mb-2">
            <span className="text-indigo-500 text-2xl sm:text-3xl">🎥</span>
            <span>Step 2: Record Your Answers</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Once the interview starts, you will be presented with questions one by one. Use your webcam and microphone to record your answers clearly and concisely.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center space-x-3 text-indigo-800 mb-2">
            <span className="text-indigo-500 text-2xl sm:text-3xl">🤖</span>
            <span>Step 3: Get AI-Powered Feedback</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            After you complete the interview, our AI will analyze your responses. It provides detailed feedback on the content of your answers, your communication skills, and your overall performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
