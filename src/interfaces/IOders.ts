export interface Option {
    title?: string;
    description: string;
    priceOne?:  number |  string;
    price: number | string;
    buttonText: string;
    type?: string;
    features?: string[];
    isRecommended?: boolean;
    priceAux?: number | string;
}

export interface OrderResponse {
    id: string;
    object: 'order';
    amount: number;
    currency_code: string;
    description: string;
    order_number: string;
    expiration_date: string;
    client_details: {
      first_name: string;
      last_name: string;
      phone_number: string;
      email: string;
    };
    metadata?: Record<string, string | number | boolean>;
}