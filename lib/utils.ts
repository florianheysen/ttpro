import React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const fetcher = (url: string) =>
    fetch(url, { cache: "no-cache", next: { revalidate: 60 } }).then((res) => res.json());

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
        const quantite = `${ingredient.qty}${ingredient.unit?.symbol === undefined ? "x" : ingredient.unit?.symbol}`;

        chaineIngredients += `- ${quantite} ${nomIngredient}\n`;
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
                totalMayonnaise += ingredient.qty * meal.qty; // Multiplier par la quantité de repas
            }
        });
    });

    // Parcourir les repas spéciaux
    data.specialMeals.forEach((specialMeal: any) => {
        specialMeal.selectedIngredients.forEach((ingredient: any) => {
            if (ingredient.name === "Mayonnaise") {
                totalMayonnaise += ingredient.qty * specialMeal.qty; // Multiplier par la quantité de repas spéciaux
            }
        });
    });

    // Parcourir les ingrédients en vrac
    data.vrac.forEach((ingredient: any) => {
        if (ingredient.name === "Mayonnaise") {
            totalMayonnaise += ingredient.qty; // Ne pas oublier de multiplier par la quantité de repas en vrac si nécessaire
        }
    });

    return totalMayonnaise;
}

export function convertOrder(order: any) {
    const client = {
        _id: order.clientId?.$oid || order._id,
        name: order.clientName,
        email_address: "",
        inserted_at: "",
        updated_at: "",
        postal_address: "",
        city: order.clientInfo?.city,
        postal_code: order.clientInfo?.postal_code,
        phone_fixe: "",
        phone_port: order.clientInfo?.phone_port,
    };

    const meals = order.meals?.map((meal: any) => ({
        mealId: meal.mealId,
        code: meal.code,
        name: meal.name,
        price: meal.price,
        category: meal.category,
        selectedIngredients: meal.selectedIngredients,
        qty: meal.qty,
        comment: meal.comment,
    }));

    const specialMeals = order.specialMeals?.map((specialMeal: any) => ({
        code: specialMeal.code,
        id: specialMeal.id,
        personnes: specialMeal.personnes,
        finalPrice: specialMeal.finalPrice,
        qty: specialMeal.qty,
        selectedIngredients: specialMeal.selectedIngredients,
        comment: specialMeal.comment,
    }));

    const vrac = order.vrac?.map((vracItem: any) => ({
        _id: vracItem._id,
        code: vracItem.code,
        name: vracItem.name,
        price: vracItem.price,
        qty: vracItem.qty,
        comment: vracItem.comment,
        unit: vracItem.unit,
    }));

    return {
        ...order,
        client,
        meals,
        specialMeals,
        vrac,
        accompte: order.accompte ?? order.deposit,
    };
}

// Permet de trier les numéros de plat par ordre croissant même si il y a une lettre dans la string
export function customComparator(a: string, b: string): number {
    // Extract numeric and alphabetic parts
    const [numA, alphaA] = splitNumericAlpha(a);
    const [numB, alphaB] = splitNumericAlpha(b);

    // Convert numeric parts to integers
    const intA = parseInt(numA);
    const intB = parseInt(numB);

    // If both are numbers, compare them directly
    if (!isNaN(intA) && !isNaN(intB)) {
        if (intA !== intB) {
            return intA - intB;
        }
    }

    // If one is a number and the other is a letter, prioritize the number
    if (!isNaN(intA) && isNaN(intB)) {
        return -1;
    } else if (isNaN(intA) && !isNaN(intB)) {
        return 1;
    }

    // Both are letters, compare them alphabetically
    return alphaA.localeCompare(alphaB);
}

export function splitNumericAlpha(str: string): [string, string] {
    // Split the string into numeric and alphabetic parts
    const match = str.match(/(\d+)(.*)/);
    if (match) {
        return [match[1], match[2]];
    }
    return ["", str];
}

/**
 * Clone React element.
 * The function clones React element and adds Tailwind CSS classnames to the cloned element
 * @param element the React element to clone
 * @param classNames Tailwind CSS classnames
 * @returns { React.ReactElement } - Cloned React element
 */
export function cloneElement(element: React.ReactElement, classNames: string) {
    return React.cloneElement(element, {
        className: twMerge(element.props.className, classNames),
    });
}
