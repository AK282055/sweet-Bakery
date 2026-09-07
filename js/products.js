/**
 * Sweet Crumbs - Bakery E-Commerce Products Database
 * Modular JavaScript data layer designed for seamless replacement with PHP/MySQL API
 * 
 * Future PHP API Endpoint: GET /backend/products.php
 * MySQL Table Equivalent: `products`, `product_weights`, `product_categories`
 */

const products = [
  {
    id: 1,
    name: "Belgian Chocolate Truffle Cake",
    slug: "belgian-chocolate-truffle-cake",
    category: "Chocolate Cakes",
    categorySlug: "chocolate-cakes",
    flavor: "Chocolate",
    tag: "Bestseller",
    price: 599,
    oldPrice: 699,
    rating: 4.9,
    reviewsCount: 184,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 399,
      "1kg": 599,
      "1.5kg": 849,
      "2kg": 1099
    },
    eggless: true,
    bestseller: true,
    featured: true,
    description: "Layers of moist Dutch-processed chocolate sponge smothered with velvety Belgian dark chocolate ganache and finished with handcrafted artisan chocolate curls.",
    ingredients: "Belgian Dark Couverture Chocolate (54%), Fresh Dairy Cream, Dutch Cocoa, Refined Wheat Flour, Butter, Sugar, Vanilla Extract.",
    allergens: "Contains Milk, Wheat (Gluten). Prepared in a kitchen that also processes nuts.",
    storageInstructions: "Store in refrigerator between 2°C to 5°C. Bring to room temperature 15 minutes before serving for maximum softness.",
    shelfLife: "3 days from delivery when refrigerated."
  },
  {
    id: 2,
    name: "Classic Red Velvet Cream Cheese Cake",
    slug: "classic-red-velvet-cream-cheese-cake",
    category: "Red Velvet",
    categorySlug: "red-velvet",
    flavor: "Red Velvet",
    tag: "Chef's Pick",
    price: 699,
    oldPrice: 799,
    rating: 4.8,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 449,
      "1kg": 699,
      "1.5kg": 999,
      "2kg": 1299
    },
    eggless: true,
    bestseller: true,
    featured: true,
    description: "Iconic crimson cocoa sponge with a subtle hint of Madagascar vanilla, paired with tangy and smooth cream cheese frosting, dusted with velvet crumbs.",
    ingredients: "Philadelphia Cream Cheese, Pure Vanilla, Buttermilk, Cocoa, Wheat Flour, Cane Sugar, Natural Red Beet Extract.",
    allergens: "Contains Milk and Dairy, Gluten.",
    storageInstructions: "Keep refrigerated. Best enjoyed chilled.",
    shelfLife: "3 days from delivery date."
  },
  {
    id: 3,
    name: "Authentic Black Forest Gateau",
    slug: "authentic-black-forest-gateau",
    category: "Birthday Cakes",
    categorySlug: "birthday-cakes",
    flavor: "Chocolate Cherry",
    tag: "Classic",
    price: 549,
    oldPrice: 620,
    rating: 4.7,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 349,
      "1kg": 549,
      "1.5kg": 799,
      "2kg": 999
    },
    eggless: true,
    bestseller: false,
    featured: true,
    description: "Layers of tender chocolate sponge soaked in natural cherry infusion, layered with light whipped cream and tart dark sweet cherries, garnished with dark chocolate flakes.",
    ingredients: "Dark Sweet Cherries, Whipped Dairy Cream, Chocolate Shavings, Cocoa Sponge, Cane Sugar.",
    allergens: "Milk, Gluten.",
    storageInstructions: "Store refrigerated at 3°C.",
    shelfLife: "48 hours from delivery."
  },
  {
    id: 4,
    name: "Sun-Kissed Pineapple Cream Cake",
    slug: "sun-kissed-pineapple-cream-cake",
    category: "Fruit Cakes",
    categorySlug: "fruit-cakes",
    flavor: "Pineapple",
    tag: "Fresh Fruit",
    price: 499,
    oldPrice: 560,
    rating: 4.7,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 329,
      "1kg": 499,
      "1.5kg": 729,
      "2kg": 929
    },
    eggless: true,
    bestseller: true,
    featured: true,
    description: "Super light vanilla chiffon infused with house-cooked tropical pineapple compote, whipped vanilla cream, and crowned with juicy golden pineapple slices.",
    ingredients: "Fresh Hawaiian Pineapple Chunks, Whipped Cream, Vanilla Sponge, Maraschino Cherries.",
    allergens: "Dairy, Gluten.",
    storageInstructions: "Refrigerate upon receipt. Consume fresh.",
    shelfLife: "2 days."
  },
  {
    id: 5,
    name: "Rich Butterscotch Crunch Cake",
    slug: "rich-butterscotch-crunch-cake",
    category: "Birthday Cakes",
    categorySlug: "birthday-cakes",
    flavor: "Butterscotch",
    tag: "Party Favorite",
    price: 599,
    oldPrice: 680,
    rating: 4.8,
    reviewsCount: 86,
    image: "https://images.unsplash.com/photo-1562772186-36894546522c?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1562772186-36894546522c?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 379,
      "1kg": 599,
      "1.5kg": 849,
      "2kg": 1099
    },
    eggless: true,
    bestseller: false,
    featured: false,
    description: "Fluffy golden sponge layered with house-made salted caramel butterscotch cream, packed with crunchy caramelized cashew praline chunks in every bite.",
    ingredients: "Caramelized Brown Sugar, Cashew Praline, Whipping Cream, Unsalted Butter, Flour.",
    allergens: "Milk, Tree Nuts (Cashews), Gluten.",
    storageInstructions: "Refrigerate at 2°C - 5°C.",
    shelfLife: "3 days."
  },
  {
    id: 6,
    name: "Wild Strawberry & Fresh Cream Cake",
    slug: "wild-strawberry-fresh-cream-cake",
    category: "Fruit Cakes",
    categorySlug: "fruit-cakes",
    flavor: "Strawberry",
    tag: "Seasonal",
    price: 649,
    oldPrice: 749,
    rating: 4.9,
    reviewsCount: 76,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 420,
      "1kg": 649,
      "1.5kg": 949,
      "2kg": 1249
    },
    eggless: true,
    bestseller: false,
    featured: true,
    description: "Delicate vanilla bean sponge filled with fragrant mountain strawberry reduction and topped with sweet glazed farm-fresh strawberries.",
    ingredients: "Handpicked Strawberries, Natural Fruit Pectin, Pure Vanilla Bean, Dairy Cream, Cake Flour.",
    allergens: "Milk, Gluten.",
    storageInstructions: "Consume within 48 hours for optimal berry freshness.",
    shelfLife: "2 days."
  },
  {
    id: 7,
    name: "Royal Ferrero Rocher Hazelnut Cake",
    slug: "royal-ferrero-rocher-hazelnut-cake",
    category: "Anniversary Cakes",
    categorySlug: "anniversary-cakes",
    flavor: "Hazelnut Nutella",
    tag: "Luxury",
    price: 899,
    oldPrice: 1049,
    rating: 5.0,
    reviewsCount: 205,
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 549,
      "1kg": 899,
      "1.5kg": 1299,
      "2kg": 1699
    },
    eggless: false,
    bestseller: true,
    featured: true,
    description: "Opulent layers of hazelnut-infused chocolate sponge, roasted hazelnut crunch, velvety Nutella mousse, adorned with genuine Ferrero Rocher pralines and edible gold dust.",
    ingredients: "Roasted Piedmont Hazelnuts, Nutella Ganache, Dark Chocolate, Crispy Wafer, Heavy Cream.",
    allergens: "Contains Hazelnuts, Tree Nuts, Milk, Gluten, Eggs.",
    storageInstructions: "Store refrigerated. Remove 10 minutes before slicing.",
    shelfLife: "4 days."
  },
  {
    id: 8,
    name: "New York Wild Blueberry Cheesecake",
    slug: "new-york-wild-blueberry-cheesecake",
    category: "Designer Cakes",
    categorySlug: "designer-cakes",
    flavor: "Blueberry Cheese",
    tag: "Premium",
    price: 799,
    oldPrice: 899,
    rating: 4.9,
    reviewsCount: 160,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 499,
      "1kg": 799,
      "1.5kg": 1149,
      "2kg": 1499
    },
    eggless: true,
    bestseller: true,
    featured: true,
    description: "Baked New York style cream cheese cake sitting on a buttery speculoos biscuit crust, smothered with house-cooked tart wild blueberry glaze.",
    ingredients: "Philadelphia Cream Cheese, Graham Biscuit Crust, Wild Canadian Blueberries, Sour Cream, Butter.",
    allergens: "Dairy, Gluten.",
    storageInstructions: "Always keep refrigerated.",
    shelfLife: "4 days."
  },
  {
    id: 9,
    name: "Belgian Chocolate Éclair Pastry (Pack of 2)",
    slug: "belgian-chocolate-eclair-pastry",
    category: "Pastries",
    categorySlug: "pastries",
    flavor: "Chocolate",
    tag: "Fresh Daily",
    price: 189,
    oldPrice: 220,
    rating: 4.8,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "2 Pcs": 189,
      "4 Pcs": 349
    },
    eggless: true,
    bestseller: false,
    featured: true,
    description: "Crispy choux-style pastry tubes piped with silky French chocolate pastry cream and glossy dark chocolate glaze.",
    ingredients: "Dark Chocolate, Dairy Milk, Cornstarch, Butter, Cane Sugar.",
    allergens: "Milk, Gluten.",
    storageInstructions: "Refrigerate and consume within 24 hours.",
    shelfLife: "1 day."
  },
  {
    id: 10,
    name: "Red Velvet Velvetina Pastry (Slice)",
    slug: "red-velvet-velvetina-pastry",
    category: "Pastries",
    categorySlug: "pastries",
    flavor: "Red Velvet",
    tag: "Individual",
    price: 129,
    oldPrice: 150,
    rating: 4.7,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "1 Slice": 129,
      "2 Slices": 239
    },
    eggless: true,
    bestseller: false,
    featured: false,
    description: "A decadent individual slice of our signature crimson red velvet sponge with rich cream cheese frosting.",
    ingredients: "Cream Cheese, Cocoa, Cane Sugar, Wheat Flour, Vanilla.",
    allergens: "Dairy, Gluten.",
    storageInstructions: "Refrigerate at 4°C.",
    shelfLife: "2 days."
  },
  {
    id: 11,
    name: "Gourmet Cupcake Assortment Box (Set of 6)",
    slug: "gourmet-cupcake-assortment-box",
    category: "Cupcakes",
    categorySlug: "cupcakes",
    flavor: "Assorted",
    tag: "Gift Ready",
    price: 499,
    oldPrice: 599,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "6 Pcs Box": 499,
      "12 Pcs Box": 899
    },
    eggless: true,
    bestseller: true,
    featured: true,
    description: "Six handcrafted bakery cupcakes: 2 Belgian Chocolate, 2 Red Velvet with cream cheese swirl, and 2 Vanilla Salted Caramel.",
    ingredients: "Unsalted Butter, Vanilla Bean, Cocoa, Natural Fruit purees, Powdered Cane Sugar.",
    allergens: "Dairy, Gluten.",
    storageInstructions: "Room temperature for 24h, then refrigerate.",
    shelfLife: "3 days."
  },
  {
    id: 12,
    name: "Grand Celebration Luxury Hamper",
    slug: "grand-celebration-luxury-hamper",
    category: "Combo / Gift Hampers",
    categorySlug: "gift-hampers",
    flavor: "Mixed Gourmet",
    tag: "Festive Exclusive",
    price: 1499,
    oldPrice: 1799,
    rating: 5.0,
    reviewsCount: 71,
    image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "Standard Hamper": 1499,
      "Royal Deluxe Hamper": 2199
    },
    eggless: true,
    bestseller: true,
    featured: true,
    description: "Includes a 0.5kg Belgian Chocolate Cake, box of 4 gourmet macarons, artisanal cinnamon cookies jar, and a celebratory scented candle.",
    ingredients: "Chocolate, Almond Flour, Cinnamon, Butter, Sugar, Vanilla.",
    allergens: "Nuts (Almonds), Milk, Gluten.",
    storageInstructions: "Cake must be refrigerated. Cookies & Macarons store cool & dry.",
    shelfLife: "Cake: 3 days. Cookies: 30 days."
  },
  {
    id: 13,
    name: "Heart-Shaped Sweet Valentine Red Rose Cake",
    slug: "heart-shaped-sweet-valentine-cake",
    category: "Anniversary Cakes",
    categorySlug: "anniversary-cakes",
    flavor: "Red Velvet Strawberry",
    tag: "Romantic",
    price: 749,
    oldPrice: 849,
    rating: 4.9,
    reviewsCount: 132,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 479,
      "1kg": 749,
      "1.5kg": 1049,
      "2kg": 1399
    },
    eggless: true,
    bestseller: false,
    featured: false,
    description: "Express your deepest emotions with this handcrafted heart-shaped red velvet sponge layered with real strawberry compote and adorned with delicate edible sugar rose petals.",
    ingredients: "Strawberry Puree, Cream Cheese, Cocoa, Flour, Cane Sugar.",
    allergens: "Dairy, Gluten.",
    storageInstructions: "Store refrigerated at 4°C.",
    shelfLife: "3 days."
  },
  {
    id: 14,
    name: "Exotic Mango Passion Fruit Gateau",
    slug: "exotic-mango-passion-fruit-gateau",
    category: "Fruit Cakes",
    categorySlug: "fruit-cakes",
    flavor: "Mango Passionfruit",
    tag: "Chef's Special",
    price: 699,
    oldPrice: 799,
    rating: 4.8,
    reviewsCount: 65,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 449,
      "1kg": 699,
      "1.5kg": 999,
      "2kg": 1299
    },
    eggless: true,
    bestseller: false,
    featured: false,
    description: "Layers of moist vanilla sponge soaked with Alphonso mango nectar, paired with tangy passion fruit curd and white chocolate mousse.",
    ingredients: "Alphonso Mango Pulp, Passion Fruit Purée, White Chocolate, Dairy Cream.",
    allergens: "Dairy, Gluten.",
    storageInstructions: "Refrigerate immediately.",
    shelfLife: "2 days."
  },
  {
    id: 15,
    name: "Rainbow Pastel Tier Birthday Cake",
    slug: "rainbow-pastel-tier-birthday-cake",
    category: "Birthday Cakes",
    categorySlug: "birthday-cakes",
    flavor: "Vanilla Berry",
    tag: "Kids Delight",
    price: 849,
    oldPrice: 999,
    rating: 4.9,
    reviewsCount: 94,
    image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "1kg": 849,
      "1.5kg": 1199,
      "2kg": 1549,
      "3kg": 2199
    },
    eggless: true,
    bestseller: false,
    featured: true,
    description: "Vibrant and cheerful pastel rainbow sponge layers sandwiched with smooth vanilla buttercream, decorated with white chocolate drip and colorful sprinkles.",
    ingredients: "Natural plant-based food coloring, Madagascar Vanilla, Whipped Buttercream, Flour.",
    allergens: "Dairy, Gluten.",
    storageInstructions: "Keep in a cool dry space or refrigerate.",
    shelfLife: "3 days."
  },
  {
    id: 16,
    name: "Artisan Tiramisu Coffee Cake",
    slug: "artisan-tiramisu-coffee-cake",
    category: "Designer Cakes",
    categorySlug: "designer-cakes",
    flavor: "Coffee Mousse",
    tag: "Italian Recipe",
    price: 749,
    oldPrice: 850,
    rating: 4.9,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80"
    ],
    weights: {
      "0.5kg": 469,
      "1kg": 749,
      "1.5kg": 1049,
      "2kg": 1399
    },
    eggless: true,
    bestseller: false,
    featured: false,
    description: "Sponge ladyfinger layers drenched in rich Italian espresso extract, layered with delicate mascarpone mousse and heavily dusted with dark Dutch cocoa.",
    ingredients: "Italian Mascarpone, Espresso Coffee, Dutch Cocoa, Sponge Biscuits, Cream.",
    allergens: "Dairy, Gluten.",
    storageInstructions: "Refrigerate at 2°C - 5°C.",
    shelfLife: "3 days."
  }
];

// Category List for Navigation, Filter Chips, and Homepage
const categories = [
  {
    name: "Birthday Cakes",
    slug: "birthday-cakes",
    image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=600&q=80",
    description: "Whimsical sprinkles, decadent chocolate, and personalized milestone cakes to celebrate in style."
  },
  {
    name: "Chocolate Cakes",
    slug: "chocolate-cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    description: "Deep Belgian couverture, silky truffles, and rich cocoa sponges for the true chocoholic."
  },
  {
    name: "Fruit Cakes",
    slug: "fruit-cakes",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80",
    description: "Refreshing natural fruits, zesty compotes, and light fluffy chiffon infused with real harvest berries."
  },
  {
    name: "Red Velvet",
    slug: "red-velvet",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80",
    description: "Signature crimson cocoa sponge layered with silky tangy Philadelphia cream cheese frosting."
  },
  {
    name: "Anniversary Cakes",
    slug: "anniversary-cakes",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=600&q=80",
    description: "Romantic hearts, gilded accents, and luxury flavors to honor your eternal love journey."
  },
  {
    name: "Designer Cakes",
    slug: "designer-cakes",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
    description: "Bespoke handcrafted centerpieces, hand-painted florals, and tiered celebratory showstoppers."
  },
  {
    name: "Pastries",
    slug: "pastries",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80",
    description: "Flaky European éclairs, individual cake slices, and dainty French patisserie delicacies."
  },
  {
    name: "Cupcakes",
    slug: "cupcakes",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80",
    description: "Individual swirls of bliss in assorted boxes, perfect for school parties and office celebrations."
  },
  {
    name: "Gift Hampers",
    slug: "gift-hampers",
    image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=600&q=80",
    description: "Thoughtfully assembled gift baskets with cakes, artisan cookies, macarons, and greeting cards."
  },
  {
    name: "Custom Cakes",
    slug: "custom-cakes",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80",
    description: "You dream it, our master pastry chefs bake it. Select flavors, themes, weights, and toppings."
  }
];

// Helper functions for easy consumption across scripts
function getAllProducts() {
  return products;
}

function getProductById(id) {
  return products.find(p => p.id === parseInt(id, 10)) || null;
}

function getProductsByCategory(categorySlug) {
  if (!categorySlug || categorySlug === 'all') return products;
  return products.filter(p => p.categorySlug.toLowerCase() === categorySlug.toLowerCase() || p.category.toLowerCase().includes(categorySlug.toLowerCase()));
}

function getFeaturedProducts() {
  return products.filter(p => p.featured);
}

function getBestsellerProducts() {
  return products.filter(p => p.bestseller);
}

// Expose globally to window for vanilla JS multi-page usage
if (typeof window !== 'undefined') {
  window.productsDB = products;
  window.categoriesDB = categories;
  window.getAllProducts = getAllProducts;
  window.getProductById = getProductById;
  window.getProductsByCategory = getProductsByCategory;
  window.getFeaturedProducts = getFeaturedProducts;
  window.getBestsellerProducts = getBestsellerProducts;
}
