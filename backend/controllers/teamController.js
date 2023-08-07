// controllers/teamController.js
const Team = require('../models/team');
const User = require('../models/user');
const Task = require('../models/task');
const jwt = require('jsonwebtoken');

exports.createTeam = async (req, res) => {
  try {
    const { teamName } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const team = new Team({
      name: teamName,
      creator: userId,
    });

    await team.save();

    await User.findByIdAndUpdate(userId, { $push: { teams: { team: team._id, role: 'creator' } } });

    return res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.inviteMembers = async (req, res) => {
  try {
    const { email } = req.body;
    const teamId = req.params.teamId; // Assuming you pass the team ID in the URL parameter

    // Find the team with the given teamId
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if the authenticated user is the team creator
    if (req.user._id.toString() !== team.creator.toString()) {
      return res.status(403).json({ error: 'Only the team creator can invite members' });
    }

    // Check if the member with the given email is the same as the team creator
    const existingMember = await User.findOne({ email });
    if (existingMember && existingMember._id.toString() === team.creator.toString()) {
      return res.status(409).json({ error: 'You are already the team creator' });
    }

    // If the member does not exist, create an invitation with the given email
    if (!existingMember) {
      // Add the member to the team as an invited member
      team.members.push({ email: email, role: 'invited' });
      await team.save();

      return res.status(200).json({ message: 'Invitation sent successfully', team });
    }

    // If the member exists but is not yet a part of the team, add them to the team
    const existingTeamMember = team.members.find((member) => member.email === email);
    if (existingTeamMember) {
      return res.status(409).json({ error: 'Member is already a part of the team' });
    }

    // Add the member to the team as an invited member
    team.members.push({ email: email, role: 'invited' });
    await team.save();

    return res.status(200).json({ message: 'Invitation sent successfully', team });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};







exports.acceptInvitation = async (req, res) => {
  try {
    const invitationId = req.params.invitationId;

    // Find the invitation with the given invitationId
    const invitation = await Team.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // Check if the invitation is still valid (you can add expiration logic if needed)
    // For example, you can check if the invitation is not already accepted or expired.

    // Add the user to the team
    const userId = req.userId; // Assuming that the authenticated user is accepting the invitation
    invitation.members.push({ user: userId, role: 'member' });
    await invitation.save();

    // Remove the invitation from the team (optional, if you want to clean up invitations)
    // await Team.findByIdAndDelete(invitationId);

    return res.status(200).json({ message: 'Invitation accepted successfully', team: invitation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
