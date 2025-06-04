# Filipe L. Q. Junqueira Portfolio

This repository contains the source code for **[filipej.dev](https://filipej.dev)**, a single page portfolio site built with [React](https://react.dev/) and [Vite](https://vitejs.dev/). The website showcases research in nanoscience, Blender 3D artwork and several software projects.

## Features

- **React + Vite** for a fast development workflow
- **Tailwind CSS** for styling and responsive layouts
- **Framer Motion** animations
- Dark mode toggle with the preference stored in `localStorage` and optionally in Firestore
- Sections for skills, teaching, career & education, publications, Blender art, command line tools and contact details

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Lint the codebase:
   ```bash
   npm run lint
   ```
4. Build a production version:
   ```bash
   npm run build
   ```

The resulting static files will be generated in the `dist/` directory.

### Firebase configuration

The site can optionally save user preferences to Firebase. When deploying you may expose two global variables before loading the application:

```html
<script>
  window.__firebase_config = { /* your firebase config */ };
  window.__app_id = 'my-portfolio';
</script>
```

If no Firebase configuration is provided, dark mode will still work using `localStorage` only.

## License

This project is released under the [MIT License](LICENSE).
