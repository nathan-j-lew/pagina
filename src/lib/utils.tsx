import imagemin from "imagemin";
import imageminJpegtran from "imagemin/jpegtran";

export const trunc = (num: number) => Number(num.toFixed(3));

export const isPointInsideElement = ({
  point,
  element,
}: {
  point: { x: number; y: number };
  element: HTMLElement;
}) => {
  const rect = element.getBoundingClientRect();
  return (
    point.x > rect.left &&
    point.x < rect.right &&
    point.y > rect.top &&
    point.y < rect.bottom
  );
};

export async function getBase64ImageUrl(imageUrl: string) {
  // fetch image and convert it to base64
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const minified = await imagemin.buffer(Buffer.from(buffer), {
    plugins: [imageminJpegtran()],
  });
  const base64 = Buffer.from(minified).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}
