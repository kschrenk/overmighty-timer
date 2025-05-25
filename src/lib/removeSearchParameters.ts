export const removeSearchParameters = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.history.replaceState({}, document.title, window.location.pathname);
};
