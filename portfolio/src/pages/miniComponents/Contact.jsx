import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitTimeoutRef = useRef(null);

  // Debounced form submission to prevent rapid clicks
  const handleMessage = useCallback(async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading || isSubmitted) return;
    
    // Clear any existing timeout
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    // Optimistic update - show success immediately
    setIsSubmitted(true);
    toast.success("Message sent successfully!");
    
    // Clear form immediately for better UX
    const originalData = { senderName, subject, message };
    setSenderName("");
    setSubject("");
    setMessage("");

    // Debounce the actual API call
    submitTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      
      try {
        await axios.post(
          "https://codeawakening.onrender.com/api/v1/message/send",
          originalData,
          {
            withCredentials: true,
            headers: { 
              "Content-Type": "application/json"
            },
            timeout: 10000
          }
        );
        
        // Success already shown optimistically
        setLoading(false);
        setIsSubmitted(false);
        
      } catch (error) {
        // Revert optimistic update on error
        setSenderName(originalData.senderName);
        setSubject(originalData.subject);
        setMessage(originalData.message);
        setIsSubmitted(false);
        setLoading(false);
        
        toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
      }
    }, 100); // Small delay to prevent accidental double-clicks
  }, [senderName, subject, message, loading, isSubmitted]);

  // Auto-reset submission state after a delay
  React.useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => setIsSubmitted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  return (
    <div id="Contact">
      <div className="overflow-x-hidden container pb-12">
          <h1
            className="text-gradient heading-secondary text-center"
          >
            CONTACT ME
          </h1>
        <form onSubmit={handleMessage} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 px-1.5">
            <Label className="text-xl text-muted-foreground">Your Name</Label>
            <Input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your Name"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2 px-1.5">
            <Label className="text-xl text-muted-foreground">Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2 px-1.5">
            <Label className="text-xl text-muted-foreground">Message</Label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end">
            {!loading && !isSubmitted ? (
              <Button 
                className="w-full sm:w-52"
                type="submit"
                disabled={!senderName || !subject || !message}
              >
                SEND MESSAGE
              </Button>
            ) : isSubmitted ? (
              <Button 
                className="w-full sm:w-52 bg-green-600 hover:bg-green-700"
                disabled
              >
                ✓ Message Sent!
              </Button>
            ) : (
              <button
                disabled
                type="button"
                className="w-full sm:w-52 text-slate-900  bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-white dark:hover:bg-slate-200 dark:focus:ring-blue-800 inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-3 text-slate-950 animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Sending...
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
