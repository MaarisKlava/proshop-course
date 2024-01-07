import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createProxyMiddleware } from 'http-proxy-middleware';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});

// To set up a proxy in Vite that not only serves APIs but also other routes, you can use the http-proxy-middleware package. Here's how you can configure the proxy in your Vite project:

// Install the http-proxy-middleware package as a development dependency:
// Install the http-proxy-middleware package as a development dependency:
// Install the http-proxy-middleware package as a development dependency:
// Create a vite.config.js file in the root of your project if it doesn't already exist.

// Inside the vite.config.js file, import the createProxyMiddleware function from http-proxy-middleware:

// Define the proxy configuration using the createProxyMiddleware function:
// In this example, the proxy configuration is set up for two paths: /api and /uploads. Adjust the target URL (http://localhost:5000) to match the actual URL of your Express server.

// The changeOrigin option is set to true to ensure that the request's origin is changed to match the target URL.

// The rewrite function is used to remove the /api prefix from the request path for the /api proxy.

// Save the vite.config.js file.
// With this configuration, any requests made to paths starting with /api or /uploads in your Vite project will be proxied to your Express server running on http://localhost:5000.

// Make sure to adjust the target URL (http://localhost:5000) to match the actual URL of your Express server.

// By setting up this proxy configuration, you can handle both API requests and static file requests from your Vite project to your Express server during development.
