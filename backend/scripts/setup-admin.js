import 'dotenv/config';
import admin from 'firebase-admin';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = require(join(__dirname, '../service-account.json'));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const email = 'shivamandal0030@gmail.com';
const password = 'Admin@1234';  // Temporary password – change after first login

async function setup() {
  let user;

  // Try to get existing user first
  try {
    user = await admin.auth().getUserByEmail(email);
    console.log(`✅ User already exists: ${user.uid}`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      // Create the user
      user = await admin.auth().createUser({ email, password, displayName: 'Shiva Admin' });
      console.log(`🆕 Created user: ${user.uid}`);
    } else {
      throw err;
    }
  }

  // Grant admin custom claim
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`🔑 Admin claim set for: ${email}`);
  console.log(`\n🎉 Done! Login credentials:`);
  console.log(`   Email   : ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`\n⚠️  Change your password after first login!\n`);
  process.exit(0);
}

setup().catch(err => { console.error('Error:', err.message); process.exit(1); });
