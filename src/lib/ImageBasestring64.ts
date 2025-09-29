
export const ImageBasestring64 = async (image: File) => {
  const arrayBuffer = await image.arrayBuffer();
  const base64string = await Buffer.from(arrayBuffer).toString("base64");
  const miniType = image.type;
  const imageBase64 =`data:${miniType};base64,${base64string}`
  return imageBase64
};
