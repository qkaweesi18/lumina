import { signUp } from "./src/firebase.js";

const email = "admin@example.com";
const password = "Password123";

signUp(email, password)
  .then(user => {
    console.log("✅ Admin user created, UID:", user.uid);
  })
  .catch(err => {
    console.error("❌ Error creating admin user:", err);
  });