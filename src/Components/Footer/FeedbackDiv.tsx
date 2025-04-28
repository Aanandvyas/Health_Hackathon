import { useState, ChangeEvent } from "react";

const FeedbackDiv = () => {
  const [feedback, setFeedback] = useState<string>("");

  const handleFeedbackChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(event.target.value);
  };

  const submitFeedback = () => {
    console.log("Feedback submitted:", feedback);
    alert("Thank you for your feedback!");
    setFeedback(""); 
  };

  return (
    <div className="max-w-md w-full bg-[#D5F5FF] text-black rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">We value your feedback</h2>
      <textarea
        className="p-3 w-full text-black bg-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none  placeholder-gray-400"
        placeholder="Let us know your thoughts..."
        value={feedback}
        onChange={handleFeedbackChange}
      
      />
      <button
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        onClick={submitFeedback}
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackDiv;
