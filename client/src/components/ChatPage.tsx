import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconSend,  
  IconUser, 
  IconMapPin, 
  IconBed, 
  IconBath, 
  IconSquare, 
  IconExternalLink, 
  IconStar, 
  IconPhone, 
  IconMail, 
  IconTrendingUp, 
  IconTrendingDown, 
  IconMinus, 
  IconCalendar, 
  IconCalculator, 
  IconPhoneCall, 
  IconRestore ,
  IconMessageChatbot,
  IconHeart
} from '@tabler/icons-react';
import { ChatMessage, Broker, MarketInsight, QuickAction } from '../types';
import { Property } from '../types';
import { SimpleChatBot } from '../utils/chatBot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/use-toast';

export function ChatPage() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const { toast } = useToast();
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true); // Track if we should auto-scroll
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI real estate assistant. I can help you find properties or schedule meetings with our brokers. What can I assist you with today?",
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBot = useRef(new SimpleChatBot());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    // Use a more stable scroll approach that doesn't interfere with user interactions
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  };

  useEffect(() => {
    // Simple scroll to bottom when new messages are added
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  // Listen for manual scroll events to manage auto-scroll behavior
  useEffect(() => {
    const scrollContainer = messagesEndRef.current?.parentElement?.parentElement;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // If user scrolls up significantly, disable auto-scroll
      if (!isNearBottom && shouldAutoScroll) {
        setShouldAutoScroll(false);
      }
      // If user scrolls back to bottom, re-enable auto-scroll
      else if (isNearBottom && !shouldAutoScroll) {
        setShouldAutoScroll(true);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [shouldAutoScroll]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const { response: aiResponse, properties, brokers, marketData, quickActions } = chatBot.current.processMessage(inputValue);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Add embeds based on response type
      if (properties && properties.length > 0) {
        setTimeout(() => addPropertyEmbed(properties), 500);
      }
      
      if (brokers && brokers.length > 0) {
        setTimeout(() => addBrokerEmbed(brokers), 600);
      }
      
      if (marketData) {
        setTimeout(() => addMarketInsightEmbed(marketData), 700);
      }
      
      if (quickActions && quickActions.length > 0) {
        setTimeout(() => addQuickActionsEmbed(quickActions), 800);
      }
      
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addPropertyEmbed = (properties: Property[]) => {
    const propertyMessage: ChatMessage = {
      id: (Date.now() + 2).toString(),
      content: '', // This will be shown as part of the embed, no separate message needed
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'property',
      embedData: { properties }
    };

    setMessages(prev => [...prev, propertyMessage]);
  };

  const addBrokerEmbed = (brokers: Broker[]) => {
    const brokerMessage: ChatMessage = {
      id: (Date.now() + 3).toString(),
      content: `Here are our available real estate experts:`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'broker',
      embedData: { brokers }
    };

    setMessages(prev => [...prev, brokerMessage]);
  };

  const addMarketInsightEmbed = (marketData: MarketInsight) => {
    const marketMessage: ChatMessage = {
      id: (Date.now() + 4).toString(),
      content: `Here's the latest market insight:`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'market-insight',
      embedData: { marketData }
    };

    setMessages(prev => [...prev, marketMessage]);
  };

  const addQuickActionsEmbed = (actions: QuickAction[]) => {
    const actionsMessage: ChatMessage = {
      id: (Date.now() + 5).toString(),
      content: `Here are some quick actions you can take:`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'quick-actions',
      embedData: { actions }
    };

    setMessages(prev => [...prev, actionsMessage]);
  };

  // Handle favorite toggle with useCallback to prevent re-renders
  const handleFavorite = useCallback((property: Property, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFavorited = favorites.includes(property.id);
    
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav !== property.id));
      toast({
        title: "Removed from favorites",
        description: `${property.title} has been removed from your favorites.`,
      });
    } else {
      setFavorites([...favorites, property.id]);
      toast({
        title: "Added to favorites",
        description: `${property.title} has been added to your favorites.`,
      });
    }
    
    // Don't disable auto-scroll for favorite actions to prevent embed re-rendering
  }, [favorites, setFavorites, toast]);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Memoized Embed Components to prevent unnecessary re-renders
  const PropertyCard = memo(({ property, isFavorited }: { property: Property; index: number; isFavorited: boolean; hasAnimated?: boolean }) => {
    return (
      <div
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-xl transition-all duration-300 group max-w-full overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative overflow-hidden rounded-lg flex-shrink-0">
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full sm:w-48 h-32 sm:h-32 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 text-xs bg-white/90 text-gray-900 font-medium z-10"
            >
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </Badge>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0 h-8 w-8 p-0 flex items-center justify-center rounded-md transition-all duration-200"
              onClick={(e) => handleFavorite(property, e)}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              onMouseDown={(e) => e.stopPropagation()} // Prevent any mouse down propagation
            >
              <IconHeart
                className={`w-3 h-3 transition-all duration-200 ${
                isFavorited
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600 hover:text-red-500'
                }`}
                strokeWidth={2}
                fill={isFavorited ? 'currentColor' : 'none'}
              />
            </Button>
          </div>
          
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-2 truncate group-hover:text-emerald-600 transition-colors">
                {property.title}
              </h4>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                <IconMapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{property.location}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                {formatPrice(property.price)}
              </div>
              
              {property.type !== 'plot' && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1">
                    <IconBed className="h-4 w-4 mr-1" />
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1">
                    <IconBath className="h-4 w-4 mr-1" />
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1">
                    <IconSquare className="h-4 w-4 mr-1" />
                    <span className="font-medium">{property.squareFootage.toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              {property.type === 'plot' && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1">
                    <IconSquare className="h-4 w-4 mr-1" />
                    <span className="font-medium">{property.squareFootage.toLocaleString()} sq ft</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors">
                <Link to={`/property/${property.id}`} className="flex items-center justify-center">
                  View Details
                  <IconExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    // Only re-render if property.id or isFavorited changes
    return (
      prevProps.property.id === nextProps.property.id &&
      prevProps.isFavorited === nextProps.isFavorited
    );
  });

  // Memoized embed container to prevent re-animations
  const EmbedContainer = memo(({ message, favorites }: { message: ChatMessage; favorites: string[] }) => {
    return (
      <div className="w-full mt-3 max-w-full">
        {/* Property Embed */}
        {message.type === 'property' && message.embedData?.properties && (
          <div className="space-y-3 max-w-full">
            {message.embedData.properties.map((property, index) => (
              <PropertyCard 
                key={`${message.id}-${property.id}`} 
                property={property} 
                index={index} 
                isFavorited={favorites.includes(property.id)}
              />
            ))}
          </div>
        )}

        {/* Broker Embed */}
        {message.type === 'broker' && message.embedData?.brokers && (
          <div className="space-y-3 max-w-full">
            {message.embedData.brokers.map((broker, index) => (
              <BrokerCard key={broker.id} broker={broker} index={index} />
            ))}
          </div>
        )}

        {/* Market Insight Embed */}
        {message.type === 'market-insight' && message.embedData?.marketData && (
          <MarketInsightCard marketData={message.embedData.marketData} />
        )}

        {/* Quick Actions Embed */}
        {message.type === 'quick-actions' && message.embedData?.actions && (
          <QuickActionsGrid actions={message.embedData.actions} />
        )}
      </div>
    );
  }, (prevProps, nextProps) => {
    // Only re-render if the message content, embed data, or specific favorites for this message's properties change
    const prevFavs = prevProps.message.embedData?.properties?.map(p => prevProps.favorites.includes(p.id)) || [];
    const nextFavs = nextProps.message.embedData?.properties?.map(p => nextProps.favorites.includes(p.id)) || [];
    
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.type === nextProps.message.type &&
      JSON.stringify(prevProps.message.embedData) === JSON.stringify(nextProps.message.embedData) &&
      JSON.stringify(prevFavs) === JSON.stringify(nextFavs)
    );
  });

  const BrokerCard = ({ broker }: { broker: Broker; index: number }) => (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-xl transition-all duration-300 max-w-full overflow-hidden"
    >
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={broker.imageUrl} alt={broker.name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
              {broker.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
            broker.availability === 'available' ? 'bg-green-500' : 
            broker.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
          }`}></div>
        </div>
        
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="mb-2">
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1 truncate">
              {broker.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 truncate">{broker.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{broker.experience} experience</p>
          </div>
          
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <IconStar key={i} className={`h-4 w-4 ${i < Math.floor(broker.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1 truncate">
              {broker.rating} ({broker.reviews} reviews)
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {broker.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <IconPhoneCall className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <IconMail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const MarketInsightCard = ({ marketData }: { marketData: MarketInsight }) => (
    <div
      className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4 max-w-full overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate flex-1 mr-4">{marketData.title}</h4>
        <div className="flex items-center gap-2 flex-shrink-0">
          {marketData.trend === 'up' && <IconTrendingUp className="h-5 w-5 text-green-600" />}
          {marketData.trend === 'down' && <IconTrendingDown className="h-5 w-5 text-red-600" />}
          {marketData.trend === 'stable' && <IconMinus className="h-5 w-5 text-gray-600" />}
          <span className={`font-bold text-lg ${
            marketData.trend === 'up' ? 'text-green-600' :
            marketData.trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {marketData.trend === 'up' ? '+' : marketData.trend === 'down' ? '-' : ''}{marketData.percentage}%
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{marketData.description}</p>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {marketData.timeframe}
      </div>
    </div>
  );

  const QuickActionsGrid = ({ actions }: { actions: QuickAction[] }) => (
    <div
      className="grid grid-cols-2 gap-3 max-w-full"
    >
      {actions.map((action) => (
        <div
          key={action.id}
          className="min-w-0"
        >
          <Button
            variant={action.variant === 'primary' ? 'default' : action.variant}
            className="w-full h-auto flex-col gap-2 p-4 text-left min-h-[80px]"
            onClick={() => handleQuickAction(action.action)}
          >
            <div className="flex items-center gap-2 w-full">
              {action.icon === 'calendar' && <IconCalendar className="h-5 w-5 flex-shrink-0" />}
              {action.icon === 'trending-up' && <IconTrendingUp className="h-5 w-5 flex-shrink-0" />}
              {action.icon === 'calculator' && <IconCalculator className="h-5 w-5 flex-shrink-0" />}
              {action.icon === 'phone' && <IconPhone className="h-5 w-5 flex-shrink-0" />}
              <span className="font-semibold text-sm truncate">{action.title}</span>
            </div>
            <p className="text-xs opacity-75 text-left w-full line-clamp-2">{action.description}</p>
          </Button>
        </div>
      ))}
    </div>
  );

  const handleQuickAction = (action: string) => {
    // Handle quick action clicks
    const actionMessages = {
      schedule_tour: "I'd like to schedule a property tour.",
      market_report: "Can you show me the latest market report?",
      mortgage_calc: "I need help calculating mortgage payments.",
      contact_expert: "I'd like to speak with a real estate expert."
    };
    
    const message = actionMessages[action as keyof typeof actionMessages] || "I'd like help with this action.";
    setInputValue(message);
  };

  const handlePresetMessage = (message: string) => {
    setInputValue(message);
    // Auto-send the message
    setTimeout(() => {
      if (message.trim()) {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          content: message,
          sender: 'user',
          timestamp: new Date().toISOString(),
          type: 'text'
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Simulate AI thinking time
        setTimeout(() => {
          const { response: aiResponse, properties, brokers, marketData, quickActions } = chatBot.current.processMessage(message);
          
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            sender: 'ai',
            timestamp: new Date().toISOString(),
            type: 'text'
          };

          setMessages(prev => [...prev, aiMessage]);
          
          // Add embeds based on response type
          if (properties && properties.length > 0) {
            setTimeout(() => addPropertyEmbed(properties), 500);
          }
          
          if (brokers && brokers.length > 0) {
            setTimeout(() => addBrokerEmbed(brokers), 600);
          }
          
          if (marketData) {
            setTimeout(() => addMarketInsightEmbed(marketData), 700);
          }
          
          if (quickActions && quickActions.length > 0) {
            setTimeout(() => addQuickActionsEmbed(quickActions), 800);
          }
          
          setIsTyping(false);
        }, 1000 + Math.random() * 1000);
      }
    }, 100);
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm your AI real estate assistant. I can help you find properties or schedule meetings with our brokers. What can I assist you with today?",
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text'
      }
    ]);
    setInputValue('');
    setIsTyping(false);
    chatBot.current.reset();
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
    
          
        </div>

        <div>
          <Card className="h-[100vh] min-h-[600px] max-h-[800px] flex flex-col">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">

                <IconMessageChatbot className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Elite Properties Assistant</span>
                <span className="sm:hidden">AI Assistant</span>
                <div className="flex-1"></div>
             
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Online</span>

                  <Button
                  onClick={resetChat}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 ml-4 border-gray-700 text-gray-700  hover:bg-rose-200 hover:border-rose-700"
                  title="Reset Chat"
                >
                  <IconRestore className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="w-full">
                      <div
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                      >
                        {message.content && (
                          <div className={`flex max-w-[85%] sm:max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 sm:gap-3`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.sender === 'user' 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}>
                              {message.sender === 'user' ? (
                                <IconUser className="h-4 w-4" />
                              ) : (
                                <IconMessageChatbot className="h-4 w-4" />
                              )}
                            </div>
                            
                            <div className={`rounded-lg px-3 sm:px-4 py-2 ${
                              message.sender === 'user'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                            }`}>
                              <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'user' 
                                  ? 'text-emerald-100' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Embeds System */}
                      {message.embedData && (
                        <EmbedContainer message={message} favorites={favorites} />
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <IconMessageChatbot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 sm:px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
              {/* Preset Buttons */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handlePresetMessage("I want to contact Janek Krupička")}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={isTyping}
                  >
                    <IconPhone className="h-3 w-3 mr-1" />
                    Contact Broker
                  </Button>
                  <Button
                    onClick={() => handlePresetMessage("Show me the cheapest properties")}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={isTyping}
                  >
                    <IconTrendingDown className="h-3 w-3 mr-1" />
                    Find Cheapest
                  </Button>
                  <Button
                    onClick={() => handlePresetMessage("Show me luxury houses")}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={isTyping}
                  >
                    <IconStar className="h-3 w-3 mr-1" />
                    Luxury Properties
                  </Button>
                  <Button
                    onClick={() => handlePresetMessage("Show me market trends")}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={isTyping}
                  >
                    <IconTrendingUp className="h-3 w-3 mr-1" />
                    Market Trends
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about properties..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="bg-emerald-600 hover:bg-emerald-700  w-12 h-10"
                >
                  <IconSend className="text-white w-8 h-8" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 hidden sm:block">
                Try asking: "Show me houses under $500k" or "I want to schedule a meeting"
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}