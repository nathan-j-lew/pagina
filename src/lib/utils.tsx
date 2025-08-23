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
