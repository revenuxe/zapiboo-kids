import { getPublicSellingCategories } from "@/lib/selling-catalog-server";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categoryImage } from "@/lib/selling-categories";

export async function SellingCategoryCards({ pincode }: { pincode?: string }) {
  const sellingCategories = await getPublicSellingCategories();
  return (
    <div className="home-category-grid landing-categories">
      {sellingCategories.map((category, index) => (
        <Link
          key={category.id}
          href={`/pickup?category=${category.id}${pincode ? `&pincode=${pincode}` : ""}`}
          className="home-category-card"
          data-category={category.id}
          style={{ backgroundColor: category.accent_color }}
        >
          <div className="home-category-top">
            <span>0{index + 1}</span>
            <span className="home-category-arrow">
              <ArrowUpRight size={19} />
            </span>
          </div>
          <div className="home-category-image">
            <Image
              src={category.image_url || categoryImage(category.id)}
              alt=""
              fill
              sizes="(min-width: 1024px) 350px, 45vw"
            />
          </div>
          <div className="home-category-caption">
            <h3>Sell {category.name.toLowerCase()}</h3>
            <p>{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
