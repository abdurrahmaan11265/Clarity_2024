// ChatbotContext.js
import React, { createContext, useState, useContext } from 'react';
import { askCareerQuestion } from './services/api';

const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [clarityQuestion, setClarityQuestion] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [clarityAnswer, setClarityAnswer] = useState('How can I help you today?');

  // Ensure handleAskClarity is defined correctly
  const handleAskClarity = async () => {
    if (!clarityQuestion.trim()) {
      setClarityAnswer('Please provide a question.');
      return;
    }

    setIsAILoading(true);
    try {
      const response = await askCareerQuestion(clarityQuestion);
      setClarityAnswer(response.answer || 'No response received.');
    } catch (error) {
      console.error('Failed to get answer from Clarity AI:', error);
      setClarityAnswer('An error occurred. Please try again.');
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        isChatOpen,
        setIsChatOpen,
        clarityQuestion,
        setClarityQuestion,
        isAILoading,
        clarityAnswer,
        handleAskClarity,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};