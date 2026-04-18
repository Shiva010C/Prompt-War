import 'dotenv/config';
import admin from 'firebase-admin';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = require(join(__dirname, '../service-account.json'));

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const demoAccounts = [
  {
    email: 'demo.admin@stadianlive.com',
    password: 'DemoAdmin@2024',
    displayName: 'Demo Admin',
    isAdmin: true,
    role: 'Admin Tester',
  },
  {
    email: 'demo.tester@stadianlive.com',
    password: 'DemoUser@2024',
    displayName: 'Demo Tester',
    isAdmin: false,
    role: 'Attendee Tester',
  },
];

async function createOrUpdateAccount(account) {
  let user;
  try {
    user = await admin.auth().getUserByEmail(account.email);
    // Update password & display name if user exists
    await admin.auth().updateUser(user.uid, {
      password: account.password,
      displayName: account.displayName,
    });
    console.log(`🔄 Updated existing user: ${account.email}`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      user = await admin.auth().createUser({
        email: account.email,
        password: account.password,
        displayName: account.displayName,
        emailVerified: true,
      });
      console.log(`🆕 Created user: ${account.email}`);
    } else {
      throw err;
    }
  }

  // Set custom claims
  await admin.auth().setCustomUserClaims(user.uid, {
    admin: account.isAdmin,
    demo: true,
  });

  return user;
}

async function setup() {
  console.log('🏟️  StadiaLive — Demo Account Setup\n');
  console.log('='.repeat(50));

  for (const account of demoAccounts) {
    await createOrUpdateAccount(account);
    console.log(`   Role    : ${account.role}`);
    console.log(`   Email   : ${account.email}`);
    console.log(`   Password: ${account.password}`);
    console.log(`   Admin   : ${account.isAdmin ? '✅ Yes' : '❌ No (Attendee)'}`);
    console.log('-'.repeat(50));
  }

  console.log('\n✅ All demo accounts ready!');
  console.log('\n📋 Access URLs:');
  console.log('   Admin Login : http://localhost:5173/admin/login');
  console.log('   App         : http://localhost:5173/');
  console.log('\n⚠️  These are demo accounts. Do not store real data.\n');
  process.exit(0);
}

setup().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
