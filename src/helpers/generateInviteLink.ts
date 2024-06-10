function generateInviteLink() {
    const inviteCode = generateUniqueInviteCode();
    return `https://localhost:3000/join?inviteId=${inviteCode}`;
  }
  
  function generateUniqueInviteCode() {
    // Generate a unique 8-character invite code
    return Math.random().toString(36).substring(2, 10);
  }

export default generateInviteLink;