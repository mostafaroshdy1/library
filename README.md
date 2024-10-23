## Library database erd

![Pasted image (4)](https://github.com/user-attachments/assets/11b4ba5d-719a-4520-9254-33fc0926576c)

**Back-End Installation:**

1. **Clone the back-end repo:**
   ```
   git clone https://github.com/mostafaroshdy1/library.git
   ```
2. **Navigate to the project directory:**
   ```
   cd library
   ```
   3. **Start Postgresql database:**
   ```
   sudo docker-compose up
   ```
3. **Install dependencies using pnpm:**
   ```
   pnpm install
   ```
4. **Run database migrations:**
   ```
   pnpm drizzle-kit migrate
   ```
5. **Start the application:**
   ```
   pnpm run start:prod
   ```
5. **Finally**
   - start testing the app through the provided postman collection

