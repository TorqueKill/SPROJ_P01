const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://wikvasjknjglndxhtjnk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpa3Zhc2prbmpnbG5keGh0am5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE2MjA1MTUsImV4cCI6MjAxNzE5NjUxNX0.L6-OCZNNI0d6xE0bbwsjvX5KPvzv-RdVagKF-QZO7ss';
const supabase = createClient(supabaseUrl, supabaseKey);

const router = express.Router();

const crypto = require('crypto');

// Generate a unique confirmation token
const generateUniqueToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Store the confirmation token in your database along with the user's ID
const storeConfirmationTokenInDatabase = async (user_email, confirmationToken) => {
  try {
    console.log("Fetching Data");
    const { data: existingRows, error: fetchError } = await supabase
      .from('confirmation_tokens')
      .select('*');

    if (fetchError) {
      console.log("Couldn't fetch");
      throw fetchError;
    }

    console.log("Existing rows: ", existingRows);

    const { data, error } = await supabase
      .from('confirmation_tokens')
      .insert([{ email: user_email, token: confirmationToken }]);

    if (error) {
      throw error;
    }

    return existingRows; // You might want to return something meaningful here
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Rethrow the error so it's not silently ignored
  }
};


// Send confirmation email with the link
const sendConfirmationEmail = async (email) => {
  try {
    // Fetch the token from confirmation_tokens based on the user's email
    const { data: tokenData, error: tokenError } = await supabase
      .from('confirmation_tokens')
      .select('token')
      .eq('email', email)
      .single();

    if (tokenError) {
      throw tokenError;
    }

    if (!tokenData) {
      throw new Error('Token not found for the given email');
    }

    const confirmationToken = tokenData.token;
    const confirmationURL = `https://localhost:3001/confirm?token=${confirmationToken}`;

    const emailContent = `
      <h2>Confirm your signup</h2>
      <p>Follow this link to confirm your user:</p>
      <p><a href="${confirmationURL}">Confirm your mail</a></p>
    `;

    // Use your email sending logic here with the modified emailContent

    console.log('Confirmation URL:', confirmationURL);
  } catch (error) {
    console.error('Error sending confirmation email:', error.message);
    // Handle the error, e.g., return a response indicating email failure
  }
};



const verifyConfirmationToken = async (token) => {
  const { data, error } = await supabase
    .from('confirmation_tokens')
    .select('user_id')
    .eq('token', token)
    .single();

  if (error) {
    throw error;
  }

  return data ? data.user_id : null;
};


const confirmUserEmail = async (userId) => {

  const { error } = await supabase
    .from('users')
    .update({ email_confirmed: true })
    .eq('id', userId);

  if (error) {
    throw error;
  }
};

module.exports = function(supabase) {

  router.post('/ok', async (req, res) => {
    const confirmationToken = generateUniqueToken();
    console.log('confirmation is', confirmationToken);
    await storeConfirmationTokenInDatabase(22321, confirmationToken);
    console.log('ok');
    return res.status(200).json({ confirmationToken });
  });

  // Signup route
  router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    console.log("Received:", email, password);
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.log("Error here");
        return res.status(400).json({ error: error.message });
      }

      const confirmationToken = generateUniqueToken();
      console.log('id', user);
      console.log('confirmation is', confirmationToken);
      await storeConfirmationTokenInDatabase(email, confirmationToken);
      console.log('ok')
      sendConfirmationEmail(email, confirmationToken);

      return res.status(200).json({ user });
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/confirm', async (req, res) => {
    const { token } = req.query;

    const userId = await verifyConfirmationToken(token);

    if (userId) {
      await confirmUserEmail(userId);

      return res.status(200).json({ message: 'Email confirmed successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid confirmation token' });
    }
  });

  // Signin route 
  router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('Received email:', email);
      console.log('Received password:', password);
      if (error) {
        console.log(error.message);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Signout route
  router.post('/signout', async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
  
      if (error) {
        console.error('Error signing out:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  

      return res.status(200).json({ message: 'User signed out successfully' });
    } catch (error) {

      console.error('Error:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  return router;
};