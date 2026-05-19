const { GoogleGenerativeAI } = require('@google/generative-ai');
const Dish = require('../models/Dish');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat with bot and get dish suggestions
exports.suggestDishes = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a prompt'
      });
    }

    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'API key not configured. Please set GEMINI_API_KEY in environment variables.'
      });
    }

    // Get all dishes from database with restaurant populated
    const allDishes = await Dish.find().populate('restaurant').lean();

    // If no dishes in database, return mock response for testing
    if (allDishes.length === 0) {
      console.log('No dishes in database, returning demo response');
      return res.status(200).json({
        success: true,
        suggestions: `Thank you for asking! Based on your preference for "${prompt}", I would normally recommend our best dishes. However, no dishes are currently in the database. Please add some dishes first to get personalized recommendations!`,
        recommendedDishes: []
      });
    }

    // Create a context string with available dishes
    let dishContext = 'Available dishes in the restaurant:\n';
    allDishes.forEach((dish) => {
      dishContext += `- ${dish.name} (${dish.cuisine}): ${dish.description} | Price: $${dish.price}\n`;
    });

    // Create the system prompt
    const systemPrompt = `You are a helpful restaurant assistant chatbot. Your job is to:
1. Understand the user's preferences and dietary requirements
2. Suggest relevant dishes based on their prompt
3. Provide helpful information about the dishes

${dishContext}

When suggesting dishes, format your response as follows:
- First, acknowledge the user's request
- Then suggest the most relevant dishes with brief explanations of why they would be good choices
- Include the dish names clearly so users can identify them

Be conversational, friendly, and helpful.`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Generate response with timeout
    let result;
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API request timeout')), 30000)
      );

      result = await Promise.race([
        model.generateContent(`${systemPrompt}\n\nUser prompt: ${prompt}`),
        timeoutPromise
      ]);
    } catch (apiError) {
      console.error('Gemini API error:', apiError);
      throw new Error(`Gemini API error: ${apiError.message}`);
    }

    const response = result.response;
    const suggestionsText = response.text();

    // Extract suggested dish names from the response
    const suggestedDishes = allDishes.filter((dish) => {
      const dishNameLower = dish.name.toLowerCase();
      return suggestionsText.toLowerCase().includes(dishNameLower);
    });

    res.status(200).json({
      success: true,
      suggestions: suggestionsText,
      recommendedDishes: suggestedDishes
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Error suggesting dishes: ' + error.message
    });
  }
};

// Multi-turn conversation
exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide conversation messages'
      });
    }

    // Get all dishes from database with restaurant populated
    const allDishes = await Dish.find().populate('restaurant').lean();

    // Create a context string with available dishes
    let dishContext = 'Available dishes in the restaurant:\n';
    allDishes.forEach((dish) => {
      dishContext += `- ${dish.name} (${dish.cuisine}): ${dish.description} | Price: $${dish.price}\n`;
    });

    // Create the system prompt
    const systemPrompt = `You are a helpful restaurant assistant chatbot. Your job is to:
1. Understand the user's preferences and dietary requirements
2. Suggest relevant dishes based on their needs
3. Answer questions about the restaurant and menu
4. Provide helpful information about the dishes

${dishContext}

When suggesting dishes, format your response clearly with dish names so users can identify them.
Be conversational, friendly, and helpful.`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Format messages for the API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Start conversation
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1),
      systemInstruction: systemPrompt
    });

    // Send the last message and get response
    const result = await chat.sendMessage(formattedMessages[formattedMessages.length - 1].parts[0].text);
    const response = result.response;
    const botResponse = response.text();

    res.status(200).json({
      success: true,
      response: botResponse
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in chat: ' + error.message
    });
  }
};
