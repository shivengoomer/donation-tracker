const bcrypt = require('bcrypt');

const comparePassword = async () => {
  const plainPassword = 'admin123';
  const hashedPassword = '$2b$10$nQdlR5NDoTkInLO2vB0G5ek07zLWyvOpyK1WWyyChb7hYZ5nP70l6';

  const isMatch = await bcrypt.hashSync(plainPassword, hashedPassword);
  console.log('Password match:', isMatch);
};

comparePassword();
