export interface Product {
  _id: string,
  name: string,
  price: number,
  minQty: number,
  qtyUnit: 'unit' | 'Kg'
}

const products: Product[] = [
  {
    _id: 'qwerty1',
    name: 'טחינה הר ברכה',
    price: 19.00,
    qtyUnit: 'unit',
    minQty: 12,
  },
  {
    _id: 'qwerty2',
    name: 'מוטי רסק עגבניות',
    price: 6.00,
    qtyUnit: 'unit',
    minQty: 12,
  },
  {
    _id: 'qwery3',
    name: 'קשיו טבעי',
    price: 50.00,
    qtyUnit: 'Kg',
    minQty: 5,
  },
  {
    _id: 'qwerty4',
    name: 'חומוס',
    price: 38.00,
    qtyUnit: 'Kg',
    minQty: 5,
  },
  {
    _id: 'qwertt5',
    name: 'קינואה',
    price: 58.00,
    qtyUnit: 'Kg',
    minQty: 5,
  },
  {
    _id: 'qwertyy7',
    name: 'עדשים כתומות',
    price: 29.00,
    qtyUnit: 'Kg',
    minQty: 5,
  }
];

export const getProducts = () => products;

export const getProductsById = (_id: string) => products.find(p => p._id === _id);
