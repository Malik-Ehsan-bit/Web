$(document).ready(function() {
  const chatBox = $("#chat-box");
  const userInput = $("#user-input");
  const sendBtn = $("#send-btn");
  
  let faqData = {
      faqs: [],
      greetings: {},
      suggestions: []
  };

  // Load FAQ data from JSON file
  function loadFAQData() {
      return $.getJSON("chat.json")
          .done(function(data) {
              faqData = data;
          })
          .fail(function() {
              console.error("Failed to load FAQ data");
              // Default fallback data
              faqData = {
                  faqs: [
                      {
                          question: "help",
                          answer: "I'm having trouble accessing the FAQ data. Please try again later or contact support."
                      }
                  ],
                  greetings: {
                      default: "Hello!"
                  },
                  suggestions: [
                      "Contact support",
                      "Try again later"
                  ]
              };
          });
  }

  // Initialize chat with greeting
  function initChat() {
      const hour = new Date().getHours();
      let greeting = faqData.greetings.default || "Hello!";
      
      if (hour < 12 && faqData.greetings.morning) {
          greeting = faqData.greetings.morning;
      } else if (hour < 18 && faqData.greetings.afternoon) {
          greeting = faqData.greetings.afternoon;
      } else if (faqData.greetings.evening) {
          greeting = faqData.greetings.evening;
      }

      addBotMessage(`${greeting} I'm SmartBot. How can I help you today?`);
      
      // Show some quick suggestions after a delay
      setTimeout(() => {
          if (faqData.suggestions && faqData.suggestions.length > 0) {
              const suggestionsList = faqData.suggestions.map(s => `- ${s}`).join("<br>");
              addBotMessage("You can ask me about:<br>" + suggestionsList);
          }
      }, 1500);
  }

  // Add user message to chat
  function addUserMessage(message) {
      chatBox.append(
          `<div class='message user-message'>${message}</div>`
      );
      scrollToBottom();
  }

  // Add bot message to chat
  function addBotMessage(message) {
      chatBox.append(
          `<div class='message bot-message'>${message}</div>`
      );
      scrollToBottom();
  }

  // Scroll chat to bottom
  function scrollToBottom() {
      chatBox.scrollTop(chatBox[0].scrollHeight);
  }

  // Process user input
  function processUserInput() {
      const message = userInput.val().trim();
      if (message === "") return;

      addUserMessage(message);
      userInput.val("");
      
      // Show typing indicator
      const typingIndicator = $("<div class='message bot-message typing-indicator'>Bot is typing...</div>");
      chatBox.append(typingIndicator);
      scrollToBottom();
      
      // Simulate thinking delay
      setTimeout(() => {
          typingIndicator.remove();
          generateBotResponse(message);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }

  // Generate bot response
  function generateBotResponse(userMessage) {
      let response = "I'm still learning! Try asking about one of the suggested topics.";
      const lowerMessage = userMessage.toLowerCase();
      
      // Check for matches in FAQs
      if (faqData.faqs && faqData.faqs.length > 0) {
          for (let faq of faqData.faqs) {
              if (lowerMessage.includes(faq.question.toLowerCase())) {
                  response = faq.answer;
                  break;
              }
          }
      }
      
      // Add some random variations
      const variations = [
          "Here's what I found:",
          "I can help with that:",
          "Sure thing:",
          "I have that information:",
          "Here you go:"
      ];
      const randomIntro = variations[Math.floor(Math.random() * variations.length)];
      
      addBotMessage(`${randomIntro}<br>${response}`);
  }

  // Event listeners
  sendBtn.click(processUserInput);
  userInput.keypress(function(e) {
      if (e.which === 13) processUserInput();
  });

  // Load data and initialize chat
  loadFAQData().always(initChat);
});