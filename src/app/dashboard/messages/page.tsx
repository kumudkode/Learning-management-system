// src/app/dashboard/messages/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronRight, Send, Paperclip, Image, Smile, MoreVertical, PhoneCall, Video, User } from 'lucide-react'

// Mock data for messages
const contacts = [
  {
    id: '1',
    name: 'Jane Smith',
    role: 'Instructor',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    lastMessage: 'Thanks for your question! Let me explain...',
    lastMessageTime: '10:45 AM',
    online: true,
    unread: 2
  },
  {
    id: '2',
    name: 'Support Team',
    role: 'Support',
    avatar: 'https://via.placeholder.com/40?text=S',
    lastMessage: 'How can we help you today?',
    lastMessageTime: 'Yesterday',
    online: true,
    unread: 0
  },
  {
    id: '3',
    name: 'Mike Wilson',
    role: 'Instructor',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    lastMessage: 'Great work on your last assignment!',
    lastMessageTime: 'Mon',
    online: false,
    unread: 0
  },
  {
    id: '4',
    name: 'React Study Group',
    role: 'Group',
    avatar: 'https://via.placeholder.com/40?text=RSG',
    lastMessage: 'Alex: Can someone explain useEffect?',
    lastMessageTime: 'Sun',
    online: false,
    unread: 3
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    role: 'Instructor',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    lastMessage: 'The next Tailwind CSS session is scheduled for...',
    lastMessageTime: 'Mar 15',
    online: false,
    unread: 0
  }
]

// Mock messages for the currently selected conversation
const mockMessages = [
  {
    id: 'm1',
    senderId: '1',
    text: 'Hello! How are you doing with the React hooks assignment?',
    time: '10:30 AM',
    read: true
  },
  {
    id: 'm2',
    senderId: 'me',
    text: "Hi Jane! I'm actually stuck on the useEffect part. I'm not sure how to properly handle cleanup functions.",
    time: '10:32 AM',
    read: true
  },
  {
    id: 'm3',
    senderId: '1',
    text: "That's a common challenge! Let me explain how cleanup works in useEffect.",
    time: '10:35 AM',
    read: true
  },
  {
    id: 'm4',
    senderId: '1',
    text: 'The cleanup function runs before the component unmounts, and also before the effect runs again if the dependencies change. This is useful for subscriptions, timers, and event listeners.',
    time: '10:36 AM',
    read: true
  },
  {
    id: 'm5',
    senderId: 'me',
    text: 'Oh, I see! So if I have a setInterval in my effect, I should return a function that clears it?',
    time: '10:40 AM',
    read: true
  },
  {
    id: 'm6',
    senderId: '1',
    text: 'Exactly! Here\'s a quick example:\n\nuseEffect(() => {\n  const timer = setInterval(() => {\n    // do something\n  }, 1000);\n\n  return () => clearInterval(timer);\n}, []);\n\nThis ensures the interval is cleaned up when the component unmounts.',
    time: '10:45 AM',
    read: false
  }
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [messageText, setMessageText] = useState('')
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Send a new message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageText.trim() === '') return
    
    // In a real app, this would send the message to an API
    console.log('Sending message:', messageText)
    setMessageText('')
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">Communicate with instructors and peers</p>
      </motion.div>
      
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex h-[calc(80vh-120px)]">
          {/* Contact sidebar */}
          <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredContacts.map(contact => (
                  <motion.div
                    key={contact.id}
                    variants={itemVariants}
                    className={`cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={contact.avatar} 
                          alt={contact.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400"></span>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{contact.lastMessageTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate pr-4">
                            {contact.lastMessage}
                          </p>
                          {contact.unread > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {contact.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Message area */}
          <div className="hidden md:flex flex-col flex-grow">
            {selectedContact ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="relative">
                      <img 
                        src={selectedContact.avatar} 
                        alt={selectedContact.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedContact.online && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
                      )}
                    </div>
                    <div className="ml-3">
                      <h2 className="font-medium text-gray-900 dark:text-white">{selectedContact.name}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{selectedContact.online ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <PhoneCall size={18} />
                    </button>
                    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Video size={18} />
                    </button>
                    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <User size={18} />
                    </button>
                    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {mockMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        variants={itemVariants}
                        className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.senderId !== 'me' && (
                          <img 
                            src={selectedContact.avatar} 
                            alt={selectedContact.name}
                            className="w-8 h-8 rounded-full object-cover mr-2 mt-1"
                          />
                        )}
                        <div className={`max-w-[70%] ${message.senderId === 'me' ? 'order-1' : 'order-2'}`}>
                          <div 
                            className={`px-4 py-3 rounded-2xl text-sm ${
                              message.senderId === 'me' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            {message.text.split('\n').map((text, i) => (
                              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                                {text}
                              </p>
                            ))}
                          </div>
                          <div className={`text-xs mt-1 flex items-center ${message.senderId === 'me' ? 'justify-end' : ''}`}>
                            <span className="text-gray-500 dark:text-gray-400">{message.time}</span>
                            {message.senderId === 'me' && (
                              <svg className={`ml-1 h-4 w-4 ${message.read ? 'text-blue-500' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <form onSubmit={sendMessage} className="flex items-end">
                    <div className="flex-grow">
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-all">
                        <div className="p-3">
                          <textarea
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="w-full focus:outline-none bg-transparent text-gray-900 dark:text-white resize-none"
                            rows={1}
                          ></textarea>
                        </div>
                        <div className="flex items-center px-3 py-2 border-t border-gray-200 dark:border-gray-600">
                          <button type="button" className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <Paperclip size={18} />
                          </button>
                          <button type="button" className="p-1 ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <Image size={18} />
                          </button>
                          <button type="button" className="p-1 ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <Smile size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="ml-3 p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex-shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {/* <MessageSquare className="h-8 w-8 text-gray-400" /> */}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Select a conversation</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Choose a contact to start messaging</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile: Show "select a conversation" when no contact is selected */}
          <div className="flex-grow md:hidden flex items-center justify-center">
            <div className="text-center p-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* <MessageSquare className="h-8 w-8 text-gray-400" /> */}
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Your Messages</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Select a conversation from the list</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}