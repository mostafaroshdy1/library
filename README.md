## Library database erd

![Pasted image (3)](https://github.com/user-attachments/assets/275ba8d6-933e-4569-896a-7318385b1578)


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

