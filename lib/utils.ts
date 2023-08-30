import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import useSWR from "swr";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function setLocal(key: string, value: string) {
    localStorage.setItem("ttpro." + key, value);
}

export function getLocal(key: string) {
    localStorage.getItem("ttpro." + key);
}

export function removeLocal(key: string) {
    localStorage.removeItem("ttpro." + key);
}

export function clearLocal() {
    localStorage.clear();
}

export function stringIngredients(ingredients: any) {
    let chaineIngredients = "";

    for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        const nomIngredient = ingredient.name;
        const quantite = `${ingredient.qty}${ingredient.unit.symbol}`;

        chaineIngredients += `${quantite} ${nomIngredient}`;

        if (i !== ingredients.length - 1) {
            chaineIngredients += ", ";
        }
    }

    return chaineIngredients;
}

export const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
};

export function calculerTotalMayonnaise(data: any) {
    let totalMayonnaise = 0;

    // Parcourir les repas normaux
    data.meals.forEach((meal: any) => {
        meal.selectedIngredients.forEach((ingredient: any) => {
            if (ingredient.name === "Mayonnaise") {
                totalMayonnaise += parseFloat(ingredient.qty);
            }
        });
    });

    // Parcourir les repas spéciaux
    data.specialMeals.forEach((specialMeal: any) => {
        specialMeal.selectedIngredients.forEach((ingredient: any) => {
            if (ingredient.name === "Mayonnaise") {
                totalMayonnaise += parseFloat(ingredient.qty);
            }
        });
    });

    // Parcourir les ingrédients en vrac
    data.vrac.forEach((ingredient: any) => {
        if (ingredient.name === "Mayonnaise") {
            totalMayonnaise += parseFloat(ingredient.qty);
        }
    });

    return totalMayonnaise;
}

export function convertObj1ToObj2(obj1: any) {
    const client = {
        _id: obj1.clientId.$oid,
        name: obj1.clientName,
        email_address: "",
        inserted_at: "",
        updated_at: "",
        postal_address: "",
        city: obj1.clientInfo.city,
        postal_code: obj1.clientInfo.postal_code,
        phone_fixe: "",
        phone_port: obj1.clientInfo.phone_port,
    };

    const meals = obj1.meals.map((meal: any) => ({
        mealId: meal.mealId,
        code: meal.code,
        name: meal.name,
        price: meal.price,
        selectedIngredients: meal.selectedIngredients,
        qty: meal.qty,
        comment: meal.comment,
    }));

    const specialMeals = obj1.specialMeals.map((specialMeal: any) => ({
        code: specialMeal.code,
        id: specialMeal.id,
        personnes: specialMeal.personnes,
        finalPrice: specialMeal.finalPrice,
        qty: specialMeal.qty,
        selectedIngredients: specialMeal.selectedIngredients,
    }));

    const vrac = obj1.vrac.map((vracItem: any) => ({
        _id: vracItem._id,
        code: vracItem.code,
        name: vracItem.name,
        price: vracItem.price,
        qty: vracItem.qty,
        comment: vracItem.comment,
        unit: vracItem.unit,
    }));

    return {
        num: obj1.num,
        seller: obj1.seller,
        client,
        meals,
        specialMeals,
        vrac,
        consigne: obj1.consigne,
        accompte: obj1.accompte,
        delivery_date: obj1.delivery_date,
        created_at: obj1.created_at,
    };
}
