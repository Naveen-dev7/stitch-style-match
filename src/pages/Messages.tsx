import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Send, Plus, Search, MessageCircle, 
  Phone, Video, MoreVertical, Paperclip, Image,
  Star, MapPin, Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
}

interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantType: 'customer' | 'tailor';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  specialties?: string[];
  rating?: number;
  location?: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetTailorId = searchParams.get('tailor');
  
  const [selectedChat, setSelectedChat] = useState<string | null>(targetTailorId || null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - in real app this would come from API/Supabase
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      participantId: "tailor_1",
      participantName: "Meera's Traditional Designs",
      participantAvatar: "/placeholder.svg",
      participantType: "tailor",
      lastMessage: "Your blouse is ready for pickup!",
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      specialties: ["Sarees", "Blouses"],
      rating: 4.9,
      location: "Mumbai"
    },
    {
      id: "2", 
      participantId: "tailor_2",
      participantName: "Crafted Couture",
      participantAvatar: "/placeholder.svg",
      participantType: "tailor",
      lastMessage: "I'll start working on your lehenga tomorrow",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      specialties: ["Lehengas", "Designer Wear"],
      rating: 4.7,
      location: "Delhi"
    },
    {
      id: "3",
      participantId: "customer_1", 
      participantName: "Priya Sharma",
      participantAvatar: "/placeholder.svg",
      participantType: "customer",
      lastMessage: "Thank you for the beautiful work!",
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: true
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "tailor_1",
      senderName: "Meera's Traditional Designs",
      text: "Hello! I've received your order details. The blouse design looks beautiful!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: "2", 
      senderId: user?.id || "current_user",
      senderName: "You",
      text: "Thank you! When can I expect it to be ready?",
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      type: 'text'
    },
    {
      id: "3",
      senderId: "tailor_1", 
      senderName: "Meera's Traditional Designs",
      text: "I'll have it ready by tomorrow evening. I'll send you photos once it's complete.",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: "4",
      senderId: "tailor_1",
      senderName: "Meera's Traditional Designs", 
      text: "Your blouse is ready for pickup!",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text'
    }
  ]);

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const filteredChats = chats.filter(chat => 
    chat.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!messageText.trim() || !selectedChat || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: "You",
      text: messageText,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to access your messages
            </p>
            <Button onClick={() => navigate('/auth')}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Messages</h1>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)] md:h-screen">
        {/* Chat List Sidebar */}
        <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-border flex-col`}>
          {/* Desktop Header */}
          <div className="hidden md:block p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold">Messages</h1>
              <Button size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredChats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`mb-2 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedChat === chat.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={chat.participantAvatar} />
                          <AvatarFallback>{chat.participantName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {chat.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-sm truncate">{chat.participantName}</h3>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(chat.lastMessageTime)}
                            </span>
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {chat.participantType === 'tailor' && (
                          <div className="flex items-center gap-2 mb-1">
                            {chat.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-muted-foreground">{chat.rating}</span>
                              </div>
                            )}
                            {chat.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{chat.location}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        
                        {chat.specialties && (
                          <div className="flex gap-1 mt-1">
                            {chat.specialties.slice(0, 2).map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-xs px-1 py-0">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            {selectedChatData && (
              <div className="p-4 border-b border-border bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden"
                      onClick={() => setSelectedChat(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedChatData.participantAvatar} />
                        <AvatarFallback>{selectedChatData.participantName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {selectedChatData.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    
                    <div>
                      <h2 className="font-semibold">{selectedChatData.participantName}</h2>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {selectedChatData.isOnline ? (
                          <span className="text-green-500">Online</span>
                        ) : (
                          <span>Last seen recently</span>
                        )}
                        {selectedChatData.participantType === 'tailor' && selectedChatData.rating && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span>{selectedChatData.rating}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image className="h-4 w-4" />
                </Button>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-muted/30">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-muted-foreground">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;