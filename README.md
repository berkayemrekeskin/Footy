# Footy

## Version 1.2

### Features

1. **User Authentication**
   - User registration
   - User login
   - Email verification

<img src="./ss/register.png" alt="Register" width="500">
<img src="./ss/login.png" alt="Login" width="500">

2. **General CRUD Operations**
   - Create, Read, Update, Delete operations for:
     - User profiles
     - Player information
     - Training forms
     - Match information

<img src="./ss/user-info-create.png" alt="User Info Create" width="500">

3. **Player Profile**
   - Basic details (name, age, weight etc.)
   - Position-specific attributes and statistics

<img src="./ss/profile.png" alt="Player Information" width="500"/>

4. **Training Forms**
   - Track training progress
   - Submit training reports
   - View past training sessions

<img src="./ss/training.png" alt="Training" width="500"/>
<img src="./ss/training-start.png" alt="Training" width="500"/>

5. **Complete Training Statistics**
   - Aggregate data on training sessions
   - Performance analysis
   - Visual representation of player statistics
  
6. **Focus Areas According to Player Statistics**
   - Personalized training recommendations
   - Highlight strengths and areas for improvement

7. **Dashboard**
   - Overview of player statistics
   - Training progress
   - Match analysis and statistics

<img src="./ss/dashboard.png" alt="Player Information" width="500"/>

8. **Player Point Algorithm**
   - Position-specific algorithm to calculate player points
   - Algorithm works on match and training data
   - Provides a comprehensive view of player performance

### Implementation Details

1. **Backend**
   - Implement user authentication with JWT
   - Setup CRUD endpoints for user, player information, and training forms with Node.js
   - Use MongoDB for data storage

2. **Frontend**
   - User-friendly forms for registration and login
   - Profile pages displaying player information
   - Dashboard for player statistics
   - Training form submissions and progress tracking
   - Match information and statistics

3. **Statistics and Analysis**
   - Generate reports based on player data
   - Provide actionable insights for performance improvement
  
### Tech Stack 
   - Node.js & Express.js for server side development.
   - React.js for frontend development.
   - MongoDB for database.
