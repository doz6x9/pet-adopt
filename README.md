# Pet Adopt

A SvelteKit + TypeScript web app that lets users browse, adopt, and care for puppies and kittens.  
All data is stored in JSON files under `static/data/`—no external database required.

---

## 🚀 Features

1. **Home** (`/`)  
   - Browse all pets (puppies & kittens)  
   - Filter by type  
   - See adoption status and click **Adopt**

2. **Authentication**  
   - Register a new account  
   - Login (passwords hashed with bcrypt)  
   - Session persisted in `localStorage`

3. **Dashboard** (`/dashboard`)  
   - View your adopted pets  
   - Track hunger & happiness levels  
   - **Feed** (use food inventory or spend \$5)  
   - **Play** (use toy inventory or spend \$10)  
   - **Return** (puts pet back and gives \$20 refund)  
   - Auto-redirect to **Shop** when you run out of items & budget  
   - See your current **budget**

4. **Shop** (`/shop`)  
   - Buy **Food (\$5)**, **Toy (\$10)**, or **Treat (\$3)**  
   - Inventory & budget update in real time

5. **Action Log** (`/logs`)  
   - Records every adoption, feed, play, and return action  
   - View chronological list with timestamps  
   - **Refresh** button to reload

6. **Admin Panel** (`/admin`)  
   - Only accessible by the **admin** user  
   - Add new pets (name, picture URL, type)  
   - Server-side guard ensures only admin can POST

---

## 🔐 Default Credentials

Log in as the preconfigured administrator:

```txt
Username: admin
Password: admin

- - -