import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Minimalist Leather Tote',
    price: 120,
    description: 'Handcrafted from genuine full-grain leather. A versatile companion for your daily commute or weekend getaway.',
    image: 'https://picsum.photos/id/20/800/800',
    category: 'Accessories',
    reviews: [
      {
        id: 'r1',
        userName: 'Sarah J.',
        rating: 5,
        comment: 'Absolutely stunning quality. The leather smells amazing and the stitching is perfect.',
        date: '2023-10-15'
      },
      {
        id: 'r2',
        userName: 'Mike T.',
        rating: 4,
        comment: 'Great bag, but I wish the strap was slightly longer.',
        date: '2023-11-02'
      }
    ]
  },
  {
    id: '2',
    name: 'Ceramic Pour-Over Set',
    price: 45,
    description: 'Experience the ritual of coffee brewing with this matte black ceramic set. Designed for optimal heat retention.',
    image: 'https://picsum.photos/id/30/800/800',
    category: 'Home',
    reviews: [
      {
        id: 'r3',
        userName: 'CoffeeLover99',
        rating: 5,
        comment: 'Makes the morning ritual so much better. Beautiful aesthetics.',
        date: '2023-09-20'
      }
    ]
  },
  {
    id: '3',
    name: 'Analog Desk Clock',
    price: 85,
    description: 'Stripped back to the essentials. A silent sweep movement mechanism housed in a solid oak frame.',
    image: 'https://picsum.photos/id/175/800/800',
    category: 'Home',
    reviews: []
  },
  {
    id: '4',
    name: 'Merino Wool Scarf',
    price: 60,
    description: 'Ultra-soft, ethically sourced merino wool. Keeps you warm without the bulk.',
    image: 'https://picsum.photos/id/103/800/800',
    category: 'Apparel',
    reviews: [
      {
        id: 'r4',
        userName: 'Jessica W.',
        rating: 5,
        comment: 'Softest scarf I own. Doesn\'t itch at all.',
        date: '2023-12-10'
      }
    ]
  },
  {
    id: '5',
    name: 'Graphite Sketch Set',
    price: 25,
    description: 'Professional grade graphite pencils for the aspiring artist. Encased in a reusable tin box.',
    image: 'https://picsum.photos/id/24/800/800',
    category: 'Art',
    reviews: []
  },
  {
    id: '6',
    name: 'Linen Bed Sheets',
    price: 150,
    description: 'Breathable, stone-washed linen that gets softer with every wash. Cool in summer, warm in winter.',
    image: 'https://picsum.photos/id/152/800/800',
    category: 'Home',
    reviews: [
      {
        id: 'r5',
        userName: 'David B.',
        rating: 3,
        comment: 'Nice texture, but the color was slightly different from the photo.',
        date: '2023-08-05'
      },
      {
        id: 'r6',
        userName: 'Anna K.',
        rating: 5,
        comment: 'Sleeping on clouds. Worth every penny.',
        date: '2023-08-20'
      }
    ]
  }
];