export interface Ingredient {
    id: string;
    qty: number;
    name: string;
    price: number;
    unit: {
        name: string;
        symbol: string;
    };
}

export interface Meal {
    id: string;
    code: string;
    name: string;
    price: number;
    comment: string;
    qty: number;
    selectedIngredients: Ingredient[];
}

export interface ClientInfo {
    phone_port: string;
    phone_fixe: string;
    city: string;
    postal_code: string;
    postal_address: string;
    email_address: string;
}

export interface Order {
    _id: string;
    num: string;
    created_at: string;
    updated_at: string;
    delivery_date: string;
    seller: string;
    clientName: string;
    clientId: string;
    clientInfo: ClientInfo;
    consigne: boolean;
    price: number;
    deposit: number;
    totalMayo: number;
    meals: Meal[];
    specialMeals: any[]; // Remplacer 'any[]' par le type approprié
    vrac: any[]; // Remplacer 'any[]' par le type approprié
}
