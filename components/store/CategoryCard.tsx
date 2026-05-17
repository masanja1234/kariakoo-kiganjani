import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  language?: "sw" | "en";
}

export function CategoryCard({ category, language = "sw" }: CategoryCardProps) {
  const name = language === "sw" ? category.nameSw : category.nameEn;
  const description = language === "sw" ? category.descriptionSw : category.descriptionEn;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group card overflow-hidden hover:shadow-md transition-all duration-200"
    >
      <div className="relative h-32 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/30 dark:to-primary-900/20 overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🛍️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
