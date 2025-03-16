// postcss.config.mjs
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss,  // Make sure to use @tailwindcss/postcss here
    autoprefixer,
  ],
};
