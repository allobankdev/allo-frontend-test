import { onBeforeUnmount } from "vue";

export function useImageResolver() {
  const objectUrls = [];

  function resolveImage(img) {
    if (typeof img === "string") return img;

    if (img instanceof File || img instanceof Blob) {
      const url = URL.createObjectURL(img);
      objectUrls.push(url);
      return url;
    }

    return "";
  }

  onBeforeUnmount(() => {
    objectUrls.forEach(url => URL.revokeObjectURL(url));
  });

  return {
    resolveImage,
  };
}