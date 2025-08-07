import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! I'm your AI travel assistant. How can I help you plan your perfect trip?",
      timestamp: new Date()
    }
  ]);

  const quickQuestions = [
    "Best time to visit?",
    "Local customs?",
    "Budget tips?"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "I understand you're asking about your travel plans. Let me help you with that!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    handleSendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white w-16 h-16 rounded-full shadow-lg hover:bg-blue-700 p-0"
      >
        <Bot className="w-8 h-8" />
      </Button>
      
      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-96 h-96 shadow-2xl">
          <div className="flex flex-col h-full">
            <div className="bg-primary text-white p-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="mr-2 w-5 h-5" />
                  <span className="font-medium">WayWise AI Assistant</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 h-auto p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.type === "bot"
                        ? "bg-gray-100 mr-auto"
                        : "bg-primary text-white ml-auto"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2 mb-2">
                <Input
                  type="text"
                  placeholder="Ask me anything about your trip..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="text-sm"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-primary text-white hover:bg-blue-700 px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
