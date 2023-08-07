const User = require('../models/user');
const Task = require('../models/task');
const Project = require('../models/projectModel')

const Team = require('../models/team');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require('../nodemailerConfig');
const nodemailer = require('nodemailer');



exports.getUsers = async (req, res) => {
  const users = await User.find({}).sort({createdAt:'desc'});
  res.status(200).json(users)
}
// get users count
exports.getUsersCount = async (req, res) => {
  // const client = new MongoClient(process.env.MONGODB_URI);
  try{
      const usersCount = await User.countDocuments({})
      res.status(200).json(usersCount)
      console.log(usersCount)
  }
  catch(error){res.status(400).json({error: error.message})}
  };

//get a single User
exports.getUser = async(req, res) => {
  const { id } = req.params
  if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: ' No such user'})
  }
  const user = await User.findById(id)

  if(!user){
      return res.status(404).json({error: 'No such error'})
  }
  res.status(200).json(user)
}
exports.deleteUser = async(req, res) => {
  const { id } = req.params
  if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: ' No such User '})
  }
  const user = await User.findOneAndDelete({_id:id})
  if(!user){
      return res.status(400).json({error: 'No such error'})
  }
  res.status(200).json(user)
}

//update a user
exports.updateUser  = async(req, res) => {
  const { id } = req.params
  if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: ' No such user'})
  }
  const user = await User.findOneAndUpdate({_id:id}, {
      ...req.body
  })
  if(!user){
      return res.status(400).json({error: 'No such error'})
  }
  res.status(200).json(user)
}


exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object with the hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Create a verification token using JWT
    const verificationToken = jwt.sign({ userId: newUser._id }, 'hellodima12$', { expiresIn: '1d' });

    // Send verification email to the user
    const mailOptions = {
      from: 'taskifyhi@example.com',
      to: email,
      subject: 'Account Verification',
      text: `Hello ${username},\n\nThank you for registering on our website. Please click the following link to verify your account: http://localhost:8000/api/users/verify/${verificationToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        // Handle error, e.g., return an error response
        return res.status(500).json({ error: 'Failed to send verification email' });
      } else {
        console.log('Verification email sent:', info.response);
        // Return success response to the client
        return res.status(201).json({ message: 'Verification email sent', user: newUser });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request:', { email, password });

    // Check if the user exists with the provided email
    const user = await User.findOne({ email });
    console.log('User:', user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify if the user's email is verified
    if (!user.emailVerified) {
      return res.status(401).json({ error: 'Email not verified. Please check your email for verification link.' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('isPasswordValid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'hellodima12$');
    console.log('Token:', token);
    res.header('Authorization', `Bearer ${token}`)
    res.cookie('jwtToken', token, { httpOnly: true });
    console.log("Cookie 'jwtToken' has been set with the value:", token);


    // Return the token and user details in the response
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        // Add other user details as needed
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.verifyAccount = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    // Verify the token using JWT
    const decodedToken = jwt.verify(verificationToken, 'hellodima12$');

    // Find the user with the decoded token's userId
    const user = await User.findById(decodedToken.userId);

    // If the user is not found, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the user is already verified, return a message indicating that
    if (user.emailVerified) {
      return res.status(200).json({ message: 'User already verified' });
    }

    user.emailVerified = true;
    await user.save();

    return res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};





exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a password reset token using JWT
    const resetToken = jwt.sign({ userId: user._id }, 'hellodima12$', { expiresIn: '24h' });
    const encodedToken = encodeURIComponent(resetToken);
    user.resetToken = encodedToken;
    await user.save();

    // Send the reset token to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'taskifyhi@gmail.com',
        pass: 'smphtowkykikeovi',
      },
    });

    const mailOptions = {
      from: 'taskifyhi@example.com',
      to: email,
      subject: 'Password Reset',
      text: `Hello ${user.username},\n\nYou have requested a password reset. Please click the following link to reset your password: http://localhost:3001/reset-password/${encodedToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to send password reset email' });
      } else {
        console.log('Password reset email sent:', info.response);
        return res.status(200).json({ message: 'Password reset email sent' });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify the token using JWT
    const decodedToken = jwt.verify(token, 'hellodima12$');

    // Find the user with the decoded token's userId
    const user = await User.findById(decodedToken.userId);

    // If the user is not found, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.handlePasswordResetLink = async (req, res) => {
  try {
    const { token } = req.params;

    const decodedToken = jwt.verify(token, 'hellodima12$');

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.redirect(`/reset-password/${token}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

  
  exports.checking = async (req, res) => {
try{
    const userEmail = req.body.email; // Update this based on your authentication setup

    console.log('User Email:', userEmail);

    // Replace the following line with the appropriate way to find a user by email in your database
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.emailVerified) {
        return res.status(200).json({ message: 'User is verified' });
      } else {
        return res.status(400).json({ message: 'User email not verified' });
      }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const secretKey = 'hellodima12$';

exports.invite = async (req, res) => {
  const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(' ')[1];
console.log(token);
if (!token) {
  // Handle missing or invalid JWT
  return res.status(401).json({ error: 'Unauthorized1' });
}


  try {
    const decodedToken = jwt.verify(token, secretKey);

    const { email } = req.body;
    const { selectedProject } = req.body;
    console.log(email);
    console.log(selectedProject);
    const authenticatedUser = decodedToken.userId; // Modify this line based on how the creator's info is obtained.
    console.log(authenticatedUser);
    if (!authenticatedUser) {
      return res.status(401).json({ error: 'Unauthorized2' });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: 'Email is not registered' });
    }

    

    const creatorUser = await User.findById(authenticatedUser);
    if (!creatorUser) {
      return res.status(404).json({ error: 'Creator user not found' });
    }

const invbef = await Team.findOne({memberEmail: email });
if (invbef) {
  if (invbef.memberEmail=== existingUser.email && invbef.creatorEmail===creatorUser.email && invbef.projectName===selectedProject && invbef.invited===true) {
    return res.status(400).json({ error: 'This email is already in the team' });
  }
  if (invbef.memberEmail=== existingUser.email && invbef.creatorEmail===creatorUser.email && invbef.projectName===selectedProject && invbef.invited===false) {
    return res.status(400).json({ error: 'Please let him check the email to accept the invitation' });
  }
}
    

    console.log(creatorUser.username);
    console.log(creatorUser.email);
    console.log(selectedProject);
  
    const newMember = {
      memberName: existingUser.username,
      memberEmail: existingUser.email,
      creatorName: creatorUser.username,
      creatorEmail: creatorUser.email,
      projectName:selectedProject
    };

    try {
      const savedMember = await Team.create(newMember);
      // The `savedMember` variable now contains the newly saved member with its unique `_id`

      // Create a verification token using JWT
      const verificationToken = jwt.sign({ userId: savedMember._id }, 'hellodima12$', { expiresIn: '1d' });

      // Send verification email to the user
   

      const mailOptions = {
        from: 'taskifyhi@example.com',
        to: email,
        subject: 'Invitation',
        text: `Hello ${savedMember.memberName},\n\n you have an invitation from ${savedMember.creatorEmail}. Please click the following link to accept the invitation: http://localhost:8000/api/users/acceptinvitation/${verificationToken}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          // Handle error, e.g., return an error response
          return res.status(500).json({ error: 'Failed to send Invitation email' });
        } else {
          console.log('Invitation email sent:', info.response);
          // Return success response to the client
          return res.status(201).json({ message: 'Invitation email sent', member: savedMember });
        }
      });
    } catch (err) {
      // If there's an error while saving the newMember to the database, handle the error
      console.error(err);
      return res.status(500).json({ error: 'Failed to save new member to the database' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.acceptinvitation = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    // Verify the token using JWT
    const decodedToken = jwt.verify(verificationToken, 'hellodima12$');

    const user = await Team.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the user is already verified, return a message indicating that
    if (user.invited) {
      return res.status(200).json({ message: 'Your already a part of the team' });
    }

    // Update the user's emailVerified field to true
    user.invited = true;
    await user.save();

    // Return a success response to the client
    return res.status(200).json({ message: 'Account Invited successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




exports.finding = async (req, res) => {
  try{
      const projectNa = req.body.selectedProject; // Update this based on your authentication setup
  
      console.log('selectedProject:', projectNa);
  
      // Replace the following line with the appropriate way to find a user by email in your database
      const projectid = await Project.findOne({ project_name: projectNa }).select('_id');
  
      if (!projectid) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(200).json({ projectid: projectid });

      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };