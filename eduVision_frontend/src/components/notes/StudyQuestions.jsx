import React, { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, X, RefreshCw } from "lucide-react";
import chatService from "../../services/chatService";

const StudyQuestions = ({ noteData, isVisible }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [questionType, setQuestionType] = useState("mixed");
  const [difficulty, setDifficulty] = useState("medium");

  useEffect(() => {
    if (isVisible && noteData?._id && (!questions || questions.length === 0)) {
      generateQuestions();
    }
  }, [isVisible, noteData?._id]);

  const generateQuestions = async () => {
    if (!noteData?._id) return;

    setIsLoading(true);
    try {
      const newQuestions = await chatService.generateStudyQuestions(
        noteData._id,
        {
          questionType,
          difficulty,
          count: 5,
        }
      );
      setQuestions(newQuestions || []);
      setSelectedAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error("Failed to generate questions:", error);
      setQuestions([]); // Ensure questions is always an array
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateScore = () => {
    if (!questions || questions.length === 0) return 0;

    const correctAnswers = questions.filter((question, index) => {
      if (question.type === "multiple-choice") {
        return selectedAnswers[index] === question.correctAnswer;
      }
      return true; // For non-multiple choice, assume correct for demo
    }).length;

    return Math.round((correctAnswers / questions.length) * 100);
  };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Study Questions
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            title="Select question type"
            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="mixed">Mixed</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="short-answer">Short Answer</option>
            <option value="essay">Essay</option>
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            title="Select difficulty level"
            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={generateQuestions}
            disabled={isLoading}
            className="p-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            title="Generate new questions"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              Generating questions...
            </span>
          </div>
        ) : !questions || questions.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Click the refresh button to generate study questions based on your
              notes
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {(questions || [])
              .filter((question) => question && question.question)
              .map((question, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white pr-4">
                      {index + 1}. {question.question}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {question.difficulty}
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {question.points}pts
                      </span>
                    </div>
                  </div>

                  {question.type === "multiple-choice" && question.options ? (
                    <div className="space-y-2">
                      {(question.options || [])
                        .filter((option) => option)
                        .map((option, optionIndex) => {
                          const optionLetter = String.fromCharCode(
                            65 + optionIndex
                          ); // A, B, C, D
                          const isSelected =
                            selectedAnswers[index] === optionLetter;
                          const isCorrect =
                            question.correctAnswer === optionLetter;

                          let buttonClass =
                            "w-full text-left p-3 border rounded-lg transition-colors ";

                          if (showResults) {
                            if (isCorrect) {
                              buttonClass +=
                                "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200";
                            } else if (isSelected) {
                              buttonClass +=
                                "bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200";
                            } else {
                              buttonClass +=
                                "bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300";
                            }
                          } else {
                            if (isSelected) {
                              buttonClass +=
                                "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200";
                            } else {
                              buttonClass +=
                                "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700";
                            }
                          }

                          return (
                            <button
                              key={optionIndex}
                              onClick={() =>
                                !showResults &&
                                handleAnswerSelect(index, optionLetter)
                              }
                              disabled={showResults}
                              className={buttonClass}
                            >
                              <div className="flex items-center">
                                <span className="font-medium mr-2">
                                  {optionLetter}.
                                </span>
                                <span>{option}</span>
                                {showResults && isCorrect && (
                                  <CheckCircle className="w-4 h-4 ml-auto text-green-600" />
                                )}
                                {showResults && !isCorrect && isSelected && (
                                  <X className="w-4 h-4 ml-auto text-red-600" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This is a {question.type} question. Write your answer in
                        your notes or discuss with your study group.
                      </p>
                    </div>
                  )}
                </div>
              ))}

            {/* Results and Actions */}
            {questions.some((q) => q.type === "multiple-choice") && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                {showResults ? (
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-2 ${getScoreColor(
                        calculateScore()
                      )}`}
                    >
                      Score: {calculateScore()}%
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={resetQuiz}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={generateQuestions}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        New Questions
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={checkAnswers}
                      disabled={Object.keys(selectedAnswers).length === 0}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      Check Answers
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyQuestions;
