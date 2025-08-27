import { Libre_Bodoni } from "next/font/google";
import ChevronLeft from "@/assets/icons/chevron-left.svg";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { getSpreadData, getSpreadSlugs } from "@/lib/spreads";
import { ScrollIndicator } from "@/components/scroll/scroll";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { CloudinaryResource } from "@cloudinary-util/types";
import cloudinary from "@/lib/cloudinary";
import { useState } from "react";

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
});

export default function Page({
  spreadData,
  images,
}: {
  spreadData: { title: string; hex: string };
  images: {
    id?: number;
    title: string;
    image: string;
    width: number;
    height: number;
    public_id: string;
    format: string;
    blurDataURL?: string;
  }[];
}) {
  const { scrollYProgress } = useScroll();
  const mix = useTransform(
    scrollYProgress,
    [0, 1],
    [spreadData.hex, "#888888"]
  );
  const [currentItem, setCurrentItem] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * images.length);
    if (latest < 0.01) return;
    setCurrentItem(index >= images.length ? images.length - 1 : index);
  });
  return (
    <div
      className={`${libreBodoni.className} font-sans scrollbar-gutter-stable`}
    >
      <motion.main
        className="flex flex-col items-center relative"
        style={{
          height: images.length > 0 ? images.length * 50 + "vh" : "100vh",
        }}
      >
        <motion.div className="sticky top-0 flex flex-col items-center">
          {images != undefined &&
            images.map(
              (image, i) =>
                i == currentItem && (
                  <div key={image.id} className="m-10">
                    <h2>{image.title}</h2>
                    <p>{image.public_id}</p>
                    <CldImage
                      src={image.public_id}
                      alt={image.public_id}
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
        </motion.div>
        <motion.div
          className="fixed inset-0 -z-1"
          layout
          layoutScroll
          layoutId="background"
          style={{
            backgroundColor: mix,
          }}
        />
        <motion.div
          className="w-full flex items-center justify-center "
          layoutId="title"
          layout="position"
        >
          {/* <motion.h2 className="text-xl font-bold text-center text-foreground">
            {spreadData.title}
          </motion.h2> */}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-1/20 left-1/20 z-10 text-lg leading-none"
        >
          <Link href="/" className="mix-blend-difference flex items-center">
            <ChevronLeft className="fill-foreground size-6" /> Back to home
          </Link>
        </motion.div>
        <ScrollIndicator scrollYProgress={scrollYProgress} />
      </motion.main>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getSpreadSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const spreadData = getSpreadData(params.slug);
  console.log(spreadData);
  if (!spreadData) {
    return {
      notFound: true,
    };
  }

  const results = await cloudinary.v2.search
    .expression(params.slug)
    .max_results(16)
    .execute();

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

  const sortedResults = reducedResults.sort((a, b) => {
    const val_a = parseInt(a.public_id.split("_")[1]);
    const val_b = parseInt(b.public_id.split("_")[1]);
    console.log(val_b);
    return val_a - val_b;
  });

  return {
    props: {
      spreadData,
      images: sortedResults,
    },
  };
}
