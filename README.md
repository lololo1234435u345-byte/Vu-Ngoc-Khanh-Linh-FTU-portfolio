# Portfolio - Vu Ngoc Khanh Linh

This is a personal portfolio website built with HTML, CSS, and Vanilla JavaScript. It features a responsive ocean-themed design, smooth scroll animations, and an anonymous "Message in a Bottle" feature using Firebase Firestore.

## 🛠 Tech Stack
- HTML5
- CSS3 (Custom Properties, Flexbox/Grid, Animations)
- Vanilla JavaScript
- Firebase (Web SDK via CDN) for the messaging backend.

## 🚀 Setup & Deployment

### 1. Update Images (Placeholders)
Replace the placeholder images in the code before publishing. Look for these paths in `index.html`:
- Open Graph Image: `<meta property="og:image" content="assets/images/og-image.jpg">`
- Gallery Carousel Images: Find the `<!-- PLACEHOLDER -->` comment in the `#about` section and replace the `src="..."` URLs with your actual image paths in the `assets/images/` directory. Be sure to update the captions!

### 2. Configure Firebase (Message in a Bottle)
Currently, the messaging feature runs in "Demo Mode". To make it functional, follow these steps:

1. **Create a Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Add a Web App:** Click the `</>` icon to add a web app. Register the app (you don't need Firebase Hosting for now if using GitHub Pages).
3. **Copy Config:** Copy the `firebaseConfig` object provided by Firebase.
4. **Paste Config:** Open `js/firebase-config.js` and replace the placeholder `firebaseConfig` with your actual config.
5. **Enable Firestore:** In the Firebase menu, go to **Firestore Database** -> **Create Database**. Start in production mode.
6. **Set Security Rules:** Go to the **Rules** tab in Firestore and deploy the following rules. This ensures visitors can only create messages (1-500 characters) but cannot read, edit, or delete them.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{message} {
      // Allow creation if the text length is between 1 and 500 characters
      allow create: if request.resource.data.text is string 
                    && request.resource.data.text.size() > 0 
                    && request.resource.data.text.size() <= 500;
                    
      // Explicitly deny read, update, and delete access
      allow read, update, delete: if false;
    }
  }
}
```

### 3. Deploy to GitHub Pages
Since this is a static site without a build step, deploying to GitHub Pages is straightforward:
1. Create a new public repository on GitHub (e.g., `portfolio`).
2. Upload all the files (`index.html`, `css/`, `js/`, `assets/`) to the repository.
3. In your repository on GitHub, go to **Settings** > **Pages**.
4. Under "Build and deployment", set the **Source** to `Deploy from a branch`.
5. Select `main` (or `master`) branch and `/ (root)` folder. Click **Save**.
6. Wait a minute or two, and your portfolio will be live at `https://<your-username>.github.io/<repository-name>/`!

## 📥 Checking Messages
To read the anonymous messages people send you:
1. Log in to the Firebase Console.
2. Go to your project -> **Firestore Database**.
3. You will see a collection named `messages` containing all the messages users have dropped into the sea.
