import '../styles/Career.css';
import { MdClose } from 'react-icons/md';
import { useChatbot } from '../ChatbotContext'; 
import  SparkleIMG  from '../assests/sparkle.svg';

const ClarityAI = () => {
  const { isChatOpen, setIsChatOpen, clarityQuestion, setClarityQuestion, handleAskClarity, clarityAnswer, isAILoading } = useChatbot(); 

  return (
    <div className="clarity-chatbot">
      {!isChatOpen ? (
        <div className="chatbot-circle" onClick={() => setIsChatOpen(true)}>
          <img src={SparkleIMG} alt="Sparkle" />  
        </div>
      ) : (
        <div className="clarity-card expanded">
          <div className="chatbot-header">
            <h2>Clarity AI</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="close-btn"
              aria-label="Close"
            >
              <MdClose size={24} color="white" />
            </button>
          </div>
          <div className="clarity-container">
            {isAILoading ? (
              <div className="loading-overlay">
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  className="clarity-input"
                  placeholder="Ask Clarity..."
                  value={clarityQuestion}
                  onChange={(e) => setClarityQuestion(e.target.value)}
                />
                <button className="clarity-btn" onClick={()=> {handleAskClarity(clarityQuestion)}}>
                  Ask Clarity
                </button>
                <div className="clarity-output">{clarityAnswer}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClarityAI;