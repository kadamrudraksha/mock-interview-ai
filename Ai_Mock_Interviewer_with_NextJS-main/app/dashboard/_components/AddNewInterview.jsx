"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  // Helper function to extract and clean JSON from AI response
  const extractJsonFromResponse = (responseText) => {
    try {
      // Remove markdown code blocks if present
      let cleanedText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Try to find JSON array using a more robust approach
      const startIndex = cleanedText.indexOf('[');
      const lastIndex = cleanedText.lastIndexOf(']');
      
      if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
        const jsonString = cleanedText.substring(startIndex, lastIndex + 1);
        
        // Clean up common issues in the JSON string
        const cleanedJson = jsonString
          .replace(/\n/g, ' ')           // Replace newlines with spaces
          .replace(/\r/g, '')            // Remove carriage returns
          .replace(/\t/g, ' ')           // Replace tabs with spaces
          .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
          .replace(/,\s*]/g, ']')        // Remove trailing commas
          .replace(/,\s*}/g, '}');       // Remove trailing commas in objects
        
        return cleanedJson;
      }
      
      throw new Error("Could not find valid JSON array in response");
    } catch (error) {
      console.error("Error extracting JSON:", error);
      throw error;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Improved prompt for better JSON generation
    const inputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}. 

Please generate exactly ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers based on the job requirements.

Return the response as a valid JSON array with this exact format:
[
  {
    "question": "Your interview question here",
    "answer": "Your detailed answer here"
  }
]

Important: 
- Return only the JSON array, no additional text
- Ensure all quotes are properly escaped
- Do not include markdown formatting
- Make answers comprehensive but concise`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();
      console.log("🚀 Raw AI Response:", responseText);
      
      // Extract and clean JSON from response
      const cleanedJsonString = extractJsonFromResponse(responseText);
      console.log("🚀 Cleaned JSON String:", cleanedJsonString);
      
      // Parse the cleaned JSON
      const mockResponse = JSON.parse(cleanedJsonString);
      console.log("🚀 Parsed Response:", mockResponse);
      
      // Validate that we have an array with the expected structure
      if (!Array.isArray(mockResponse) || mockResponse.length === 0) {
        throw new Error("Invalid response format: Expected non-empty array");
      }
      
      // Validate that each item has question and answer fields
      mockResponse.forEach((item, index) => {
        if (!item.question || !item.answer) {
          throw new Error(`Invalid item at index ${index}: Missing question or answer field`);
        }
      });
      
      setJsonResponse(mockResponse);
      
      // Save to database
      const res = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(mockResponse),
          jobPosition: jobPosition,
          jobDesc: jobDescription,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY'),
        }).returning({ mockId: MockInterview.mockId });
      
      console.log("✅ Interview saved successfully:", res[0]?.mockId);
      
      // Close dialog and navigate
      setOpenDialog(false);
      router.push(`/dashboard/interview/${res[0]?.mockId}`);
      
    } catch (error) {
      console.error("❌ Error creating interview:", error);
      // You might want to show a user-friendly error message here
      alert("Failed to generate interview questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h1 className="font-bold text-lg text-center">+ Add New</h1>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Tell us more about your job Interviewing
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <p>
                  Add details about your job position/role, job description, and
                  years of experience
                </p>
                <div className="mt-7 my-3">
                  <label>Job Role/Job Position</label>
                  <Input
                    placeholder="Ex. Full Stack Developer"
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>
                <div className="my-3">
                  <label>Job Description/Tech Stack (In short)</label>
                  <Textarea
                    placeholder="Ex. React, Angular, NodeJs, MySql etc"
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                <div className="my-3">
                  <label>Years of Experience</label>
                  <Input
                    placeholder="Ex. 5"
                    type="number"
                    min="1"
                    max="70"
                    required
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Generating from AI
                    </>
                  ) : (
                    'Start Interview'
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;