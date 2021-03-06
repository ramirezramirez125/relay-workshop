import { createPath, parsePath } from 'history';

export const getMockHistory = ({ context = {}, location: loc = '/' }) => {
  if (typeof loc === 'string') loc = parsePath(loc);

  const action = 'POP';
  const location = {
    pathname: loc.pathname || '/',
    search: loc.search || '',
    hash: loc.hash || '',
    state: loc.state || null,
    key: loc.key || 'default',
  };

  const mockHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    push(location, state) {
      const url = createPath(location);

      if (__DEV__) {
        // A PUSH is not technically valid in a static context because we can't
        // push a new URL onto the history stack in a stateless environment. They
        // most likely want a regular redirect so just warn them and carry on.
        // eslint-disable-next-line
        console.warn(
          `You cannot perform a PUSH with a static router. You probably want a REPLACE instead.` +
            `\n\nTo avoid this warning, find the element that is calling \`navigate("${url}")\`` +
            ` and change it to \`navigate("${url}", { replace: true })\`. This could also be` +
            ` caused by rendering a \`<Navigate to={"${url}"} />\` on the server. In that` +
            ` case, just add a \`replace: true\` prop to do a redirect instead.`,
        );
      }

      context.url = url;
      context.state = state;
    },
    replace(location, state) {
      const url = createPath(location);
      context.url = url;
      context.state = state;
    },
    go(n) {
      throw new Error(
        `You cannot perform ${n === -1 ? 'GO BACK' : `GO(${n})`} on the ` +
          `server because it is a stateless environment. This error was probably ` +
          `triggered when you did a \`navigate(${n})\` somewhere in your app.`,
      );
    },
    listen() {},
    block() {},
  };

  return mockHistory;
};
