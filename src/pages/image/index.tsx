import { Libre_Bodoni } from "next/font/google";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSortedSpreadsData } from "@/lib/spreads";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import cloudinary from "@/lib/cloudinary";
import { CloudinaryResource } from "@cloudinary-util/types";

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
});

export default function ImageTest({
  images,
}: {
  // props: {
  images: {
    id?: number;
    title: string;
    image: string;
    width: number;
    height: number;
  }[];
  // };
}) {
  // console.log(props);
  // useEffect(() => {
  //   console.log(images);
  // }, [images]);
  const { scrollYProgress } = useScroll();
  const [currentItem, setCurrentItem] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * images.length);
    if (latest < 0.01) return;
    setCurrentItem(index >= images.length ? images.length - 1 : index);
  });

  // const resources = await cloudinary.search.expression("boggeri");
  return (
    <div
      className={`${libreBodoni.className} font-sans scrollbar-gutter-stable`}
      style={{ height: images.length * 50 + "vh" }}
    >
      <nav className="fixed top-0 inset-x-0 z-10">
        <div className="px-[5%]">
          <Link href="/">Back</Link>
        </div>
      </nav>
      <motion.main className="sticky top-0 flex flex-col items-center relative">
        {images != undefined &&
          images.map(
            (image: any) =>
              image.id == currentItem && (
                <div key={image.id} className="m-10">
                  <h2>{image.title}</h2>
                  <CldImage
                    src={image.public_id}
                    alt={image.id ? `Image ${image.id}` : "Image"}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ width: "100%", height: "auto" }}
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                  />
                </div>
              )
          )}
      </motion.main>
    </div>
  );
}

export async function getStaticProps() {
  // cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET,
  //   secure: true,
  // });

  const results = await cloudinary.v2.search
    .expression("boggeri")
    .max_results(16)
    .execute();
  // .then((res) => {
  //   res.resources;
  // });
  const resources: CloudinaryResource[] = results.resources;

  const reducedResults: {
    id: number;
    height: number;
    width: number;
    public_id: string;
    format: string;
    blurDataURL?: string;
  }[] = [];

  let i = 0;
  async function getBase64Image(url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${response.type};base64,${base64}`;
    return dataUrl;
  }

  for (const result of resources) {
    const imageUrl = getCldImageUrl({
      src: result.public_id,
      width: 100, // Resize the original file to a smaller size
    });
    const blurDataUrl = await getBase64Image(imageUrl);

    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      blurDataURL: blurDataUrl,
    });
    i++;
  }

  // console.log(reducedResults);

  return {
    props: { images: reducedResults },
  };
}
