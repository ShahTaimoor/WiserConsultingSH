/**
 * Create an admin user, or reset an existing admin's password.
 *
 * Usage (from the backend folder):
 *   ADMIN_EMAIL=you@site.com ADMIN_PASSWORD='StrongPass123' ADMIN_NAME='Your Name' node scripts/createAdmin.js
 *   ADMIN_EMAIL=you@site.com ADMIN_PASSWORD='NewStrongPass' node scripts/createAdmin.js --reset
 *
 * ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME can also be put in backend/.env.
 * --reset  sets a new password for an existing user and makes them an admin.
 */

require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const reset = process.argv.includes('--reset');

const fail = (msg) => {
  console.error(`❌ ${msg}`);
  process.exit(1);
};

const run = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || email?.split('@')[0];

  if (!process.env.MONGODB_URI) fail('MONGODB_URI is not set (check backend/.env)');
  if (!email || !password) fail('Set ADMIN_EMAIL and ADMIN_PASSWORD (see usage at the top of this file)');
  if (password.length < 8) fail('ADMIN_PASSWORD must be at least 8 characters');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existing = await User.findOne({ email });

    if (existing) {
      if (!reset) {
        console.log(`⚠️  A user with ${email} already exists (role: ${existing.role === 1 ? 'admin' : 'user'}).`);
        console.log('   Run again with --reset to set a new password and make this user an admin.');
        return;
      }
      existing.password = hashedPassword;
      existing.role = 1;
      existing.isDeleted = false;
      await existing.save();
      console.log(`✅ Password reset. ${email} is now an admin.`);
      return;
    }

    if (reset) fail(`No user found with ${email} — run without --reset to create one`);

    await User.create({ name, email, password: hashedPassword, role: 1 });
    console.log(`✅ Admin created: ${email}`);
    console.log('   Log in at /login with this email and the password you set.');
  } catch (error) {
    fail(`Could not create admin: ${error.message}`);
  } finally {
    await mongoose.connection.close();
  }
};

run().catch((err) => fail(err.message));
