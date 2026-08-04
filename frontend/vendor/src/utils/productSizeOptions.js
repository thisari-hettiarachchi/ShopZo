const CLOTHING_KEYWORDS = [
  "cloth",
  "apparel",
  "fashion",
  "wear",
  "shirt",
  "t-shirt",
  "tshirt",
  "dress",
  "pant",
  "jean",
  "trouser",
  "skirt",
  "jacket",
  "hoodie",
  "sweater",
  "top",
  "bottom",
  "men",
  "women",
  "kids wear",
  "kid's wear",
  "garment",
];

const FOOTWEAR_KEYWORDS = [
  "shoe",
  "footwear",
  "sneaker",
  "boot",
  "sandal",
  "slipper",
  "heel",
];

const ELECTRONICS_KEYWORDS = [
  "electronic",
  "phone",
  "mobile",
  "laptop",
  "computer",
  "gadget",
  "tech",
  "accessories",
  "headphone",
  "earbud",
  "camera",
  "watch",
];

const BEAUTY_KEYWORDS = [
  "beauty",
  "cosmetic",
  "skincare",
  "makeup",
  "perfume",
  "personal care",
];

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const FOOTWEAR_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
export const ELECTRONICS_SIZES = ["One Size", "64GB", "128GB", "256GB", "512GB", "1TB"];
export const GENERAL_SIZES = ["One Size", "Free Size", "Small", "Medium", "Large"];
export const BEAUTY_SIZES = ["One Size", "Travel Size", "Standard", "Value Pack"];

const matchesKeywords = (categoryName, keywords) => {
  const value = String(categoryName || "").toLowerCase();
  return keywords.some((keyword) => value.includes(keyword));
};

export const getSizeCategoryType = (categoryName) => {
  if (matchesKeywords(categoryName, FOOTWEAR_KEYWORDS)) return "footwear";
  if (matchesKeywords(categoryName, CLOTHING_KEYWORDS)) return "clothing";
  if (matchesKeywords(categoryName, ELECTRONICS_KEYWORDS)) return "electronics";
  if (matchesKeywords(categoryName, BEAUTY_KEYWORDS)) return "beauty";
  return "general";
};

export const getSizeOptionsForCategory = (categoryName) => {
  switch (getSizeCategoryType(categoryName)) {
    case "clothing":
      return CLOTHING_SIZES;
    case "footwear":
      return FOOTWEAR_SIZES;
    case "electronics":
      return ELECTRONICS_SIZES;
    case "beauty":
      return BEAUTY_SIZES;
    default:
      return GENERAL_SIZES;
  }
};

export const getDefaultSizesForCategory = () => [];

export const getSizeFieldLabel = (categoryName) => {
  switch (getSizeCategoryType(categoryName)) {
    case "clothing":
      return "Clothing Sizes";
    case "footwear":
      return "Shoe Sizes";
    case "electronics":
      return "Variant / Capacity";
    case "beauty":
      return "Pack Size";
    default:
      return "Size / Variant";
  }
};
