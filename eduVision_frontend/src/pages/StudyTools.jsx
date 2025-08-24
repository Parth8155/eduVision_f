import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, BookOpen, HelpCircle, ChevronLeft, ChevronRight, FileText, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import studyToolsService from "@/services/studyToolsService";

const StudyTools = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("mcq");
  const [generatedMCQs, setGeneratedMCQs] = useState([]);
  const [generatedSummaries, setGeneratedSummaries] = useState([]);
  const [loadingGenerated, setLoadingGenerated] = useState(false);

  // UI state for the MCQ runner
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Placeholder static arrays (kept empty so UI shows "select first")
  const mcqQuestions = [];
  const summaryCards = [];
  const practiceQuestions = [];

  // Load study material if navigated with state or ?material= query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const materialIdFromQuery = params.get("material");
    const materialId = (location.state && location.state.studyMaterialId) || materialIdFromQuery;

    if (!materialId) return;

    const loadMaterial = async () => {
      setLoadingGenerated(true);
      try {
        const resp = await studyToolsService.getStudyMaterialById(materialId);
        const mat = resp?.data?.studyMaterial || resp?.studyMaterial || resp?.data || resp;

        if (!mat) throw new Error("No study material returned from server");

        if (mat.type === "mcq") {
          const gm = {
            questions: Array.isArray(mat.content) ? mat.content : mat.content?.questions || [],
            noteInfo: {
              id: mat.sourceNote?._id || mat.sourceNoteId || null,
              subject: mat.subject,
              title: mat.sourceNote?.title || mat.title,
            },
            generatedAt: mat.createdAt,
            contentType: "mcq",
          };
          setGeneratedMCQs([gm]);
          setActiveTab("mcq");
        } else if (mat.type === "summary") {
          const gs = {
            summary: Array.isArray(mat.content) ? mat.content[0] : mat.content || {},
            noteInfo: {
              id: mat.sourceNote?._id || mat.sourceNoteId || null,
              subject: mat.subject,
              title: mat.sourceNote?.title || mat.title,
            },
            generatedAt: mat.createdAt,
            contentType: "summary",
          };
          setGeneratedSummaries([gs]);
          setActiveTab("summaries");
        } else if (mat.type === "practice") {
          const gp = {
            questions: Array.isArray(mat.content) ? mat.content : mat.content?.questions || [],
            noteInfo: {
              id: mat.sourceNote?._id || mat.sourceNoteId || null,
              subject: mat.subject,
              title: mat.sourceNote?.title || mat.title,
            },
            generatedAt: mat.createdAt,
            contentType: "practice",
          };
          setGeneratedMCQs([gp]);
          setActiveTab("practice");
        }
      } catch (error) {
        console.error("Failed to load study material:", error);
      } finally {
        setLoadingGenerated(false);
      }
    };

    loadMaterial();
  }, [location]);

  // Map generated sets to UI-friendly arrays
  const getCurrentMCQs = () => {
    if (generatedMCQs.length > 0 && activeTab === "mcq") {
      const latestGenerated = generatedMCQs[0];
      if (latestGenerated.questions) {
        return latestGenerated.questions.map((q) => ({
          ...q,
          id: q.id || Math.random(),
          subject: latestGenerated.noteInfo?.subject || "Generated",
          explanation: q.explanation || "",
        }));
      }
    }
    return mcqQuestions;
  };

  const getCurrentSummaries = () => {
    const generated = generatedSummaries.map((summary) => ({
      title: summary.summary?.title || summary.noteInfo?.title || "Generated Summary",
      content: summary.summary?.content || "Summary content not available",
      keyPoints: summary.summary?.keyPoints || [],
      difficulty: "Generated",
      readTime: summary.summary?.readTime || "5 min",
      isGenerated: true,
      noteInfo: summary.noteInfo,
      generatedAt: summary.generatedAt,
    }));

    return [...generated, ...summaryCards];
  };

  const currentMCQs = getCurrentMCQs();
  const currentSummaries = getCurrentSummaries();

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex.toString());
  };

  const handleSubmitAnswer = () => {
    setShowResult(true);
    const correct = currentMCQs[currentQuestion]?.correct;
    if (correct !== undefined && selectedAnswer === String(correct)) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((i) => Math.min(i + 1, currentMCQs.length - 1));
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestion((i) => Math.max(i - 1, 0));
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Tools</h1>
              <p className="text-gray-600 dark:text-gray-400">Practice with AI-generated questions and review your study materials</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
            <TabsTrigger value="mcq" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>MCQs {generatedMCQs.length > 0 && <span className="ml-1 text-xs bg-blue-500 text-white px-1 rounded">NEW</span>}</span>
            </TabsTrigger>
            <TabsTrigger value="summaries" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Summaries {generatedSummaries.length > 0 && <span className="ml-1 text-xs bg-blue-500 text-white px-1 rounded">NEW</span>}</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>Practice Questions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mcq">
            {currentMCQs.length === 0 ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No MCQs selected</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Select a study material from the Library or generate MCQs for a note to begin.</p>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-gray-900 dark:text-white">Question {currentQuestion + 1} of {currentMCQs.length}</CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">{currentMCQs[currentQuestion]?.subject} • {currentMCQs[currentQuestion]?.difficulty}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Score: {score}/{currentMCQs.length}</Badge>
                      </div>
                      <Progress value={(currentQuestion / currentMCQs.length) * 100} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="text-lg font-medium text-gray-900 dark:text-white">{currentMCQs[currentQuestion]?.question}</div>

                        <div className="space-y-3">
                          {currentMCQs[currentQuestion]?.options?.map((option, index) => (
                            <div
                              key={index}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                selectedAnswer === index.toString()
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                              } ${
                                showResult &&
                                index === currentMCQs[currentQuestion]?.correct
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400"
                                  : showResult &&
                                    selectedAnswer === index.toString() &&
                                    index !== currentMCQs[currentQuestion]?.correct
                                  ? "border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-400"
                                  : ""
                              }`}
                              onClick={() => !showResult && handleAnswerSelect(index)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === index.toString() ? "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400" : "border-gray-300 dark:border-gray-600"}`}>
                                  {selectedAnswer === index.toString() && (<div className="w-2 h-2 bg-white rounded-full"></div>)}
                                  {showResult && index === currentMCQs[currentQuestion]?.correct && (<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />)}
                                  {showResult && selectedAnswer === index.toString() && index !== currentMCQs[currentQuestion]?.correct && (<span className="text-red-600">✖</span>)}
                                </div>
                                <span className="text-gray-900 dark:text-gray-100">{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {showResult && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Explanation:</h4>
                            <p className="text-blue-800 dark:text-blue-300">{currentMCQs[currentQuestion]?.explanation}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-6">
                          <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}><ChevronLeft className="w-4 h-4 mr-2" />Previous</Button>
                          {!showResult ? (
                            <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Submit Answer</Button>
                          ) : (
                            <Button onClick={handleNextQuestion} disabled={currentQuestion === currentMCQs.length - 1} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Next Question <ChevronRight className="w-4 h-4 ml-2" /></Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="summaries">
            {/* Use a single-column layout so each summary card uses full width of the content area */}
            <div className="grid grid-cols-1 gap-6">
              {currentSummaries.map((card, index) => (
                <Card key={index} className={`w-full hover:shadow-lg transition-shadow overflow-hidden dark:bg-gray-800 dark:border-gray-700 ${card.isGenerated ? 'ring-2 ring-blue-500/20 border-blue-200 dark:border-blue-700' : ''}`}>
                  <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg dark:text-white">{card.title}</CardTitle>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center space-x-2">
                      {card.isGenerated && (<Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">AI Generated</Badge>)}
                      <Badge variant={card.difficulty === "Easy" || card.difficulty === "Generated" ? "secondary" : card.difficulty === "Medium" ? "default" : "destructive"}>{card.difficulty}</Badge>
                      <CardDescription className="flex items-center space-x-2 dark:text-gray-400"><Clock className="w-4 h-4" /><span className="ml-1">{card.readTime}</span>{card.isGenerated && card.noteInfo && (<><span className="mx-2">•</span><span>{card.noteInfo.subject}</span></>)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Left: summary content (spans 2 columns on md+) */}
                      <div className="md:col-span-3">
                        {card.isGenerated ? (
                          <div className="prose prose-lg dark:prose-invert max-w-none break-words">
                            <div
                              className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: card.content
                                  .replace(/### /g, "<h3>")
                                  .replace(/#### /g, "<h4>")
                                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                  .replace(/\n/g, "<br/>")
                              }}
                            />
                          </div>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{card.content}</p>
                        )}
                      </div>

                      {/* Right: key points and actions */}
                      <div className="md:col-span-1 flex flex-col justify-between md:max-w-xs">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Key Points</h4>
                          <ul className="mt-3 space-y-2">
                            {card.keyPoints.map((point, pointIndex) => (
                              <li key={pointIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6">
                          <Button variant="outline" size="sm" className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"><FileText className="w-4 h-4 mr-2" />View Full Summary</Button>
                          {card.isGenerated && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Generated {new Date(card.generatedAt).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="practice">
            <div className="space-y-6">
              {practiceQuestions.map((question, index) => (
                <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg dark:text-white">Question {index + 1}</CardTitle>
                      <div className="flex items-center space-x-2"><Badge variant="outline">{question.type}</Badge><Badge>{question.points} points</Badge></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-900 dark:text-white font-medium">{question.question}</p>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hints:</h4>
                        <ul className="space-y-1">
                          {question.hints.map((hint, hintIndex) => (
                            <li key={hintIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2"><HelpCircle className="w-3 h-3 mt-1 text-blue-500 dark:text-blue-400" /><span>{hint}</span></li>
                          ))}
                        </ul>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 dark:bg-gray-700">
                        <textarea placeholder="Write your answer here..." className="w-full h-32 resize-none border-0 focus:outline-none text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Save Draft</Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Submit Answer</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudyTools;
