# @nimpl/router

Edge router for next.js apps. Allows you to configure rewrites, redirects, i18n and basePath at the middleware level instead of next.config.js.

Visit https://nimpl.tech/router to view the full documentation.

```js
import { createMiddleware } from "@nimpl/router";

export const middleware = createMiddleware({
  redirects: [
    {
      source: "/old",
      destination: "/",
      permanent: false,
    },
  ],
  rewrites: [
    {
      source: "/home",
      destination: "/",
      locale: false,
    },
  ],
  basePath: "/doc",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
  },
});
```

## Installation

**Using npm:**

```bash
npm i @nimpl/router
```

**Using yarn:**

```bash
yarn add @nimpl/router
```

## Additional

Please consider giving a star if you like it, it shows that the package is useful and helps continue work on this and other packages.

Create issues for identified issues, desired getters, or various improvements.

## License

[MIT](https://github.com/vordgi/nimpl-router/blob/main/LICENSE)
