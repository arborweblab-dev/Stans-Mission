<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Stan's Mission | Washtenaw County Pup Aid</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              emerald: {
                DEFAULT: '#10b981',
                50: '#ecfdf5',
                100: '#d1fae5',
                400: '#34d399',
                500: '#10b981',
                600: '#059669',
              }
            }
          }
        }
      }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background-color: #0a0a0a;
        color: #f5f5f5;
        overscroll-behavior-y: none;
        margin: 0;
        padding: 0;
      }
      #root {
        width: 100%;
        min-height: 100vh;
        display: flex;
        justify-content: center;
      }
    </style>
  </head>
  <body class="bg-neutral-950 text-neutral-100">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
