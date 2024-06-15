import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        
        const collection = db.collection('orders');

        // Filtres
        const cursor = collection.find({ 
            "meals.code": 'PL5', 
            "meals.name": "PL 5 (2 lang, 2 gambas, 1 pince, 8 CF, 150g bulot, 50g bigor, 50g grises, 6 huîtres, 1 palourde, 1 praire, 1 clams, 1 demie-lang, 1 demi-tourteau)"
        });
    
        while (await cursor.hasNext()) {
            const doc: any = await cursor.next();
            doc.meals.forEach((meal: any) => {
                // Changer le contenu des propriétés
                meal.selectedIngredients = [
                    {
                        "id": "a3f6a2cac5d64a1ba0b99c88",
                        "name": "(c) langoustine plateau",
                        "price": 4.2,
                        "qty": 2,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "9d4d4825e3704a449a7fedd0",
                        "name": "(d) gambas plateau",
                        "price": "3.6",
                        "qty": 2,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "b6b813f3e3e44485820e3481",
                        "name": "(e) pince plateau",
                        "price": 4.8,
                        "qty": 1,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "b001f87b9cdf48cbbef71a35",
                        "name": "crevettes fraîches bio (pièce) PLATEAUX P1 à P5",
                        "price": "0.00",
                        "qty": 8,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "784681254cc945368210972d",
                        "name": "(g) crevettes grises (kg) PLATEAU",
                        "price": 46.8,
                        "qty": 0.05,
                        "units": {
                            "name": "kilogramme",
                            "symbol": "kg"
                        }
                    },
                    {
                        "id": "a7283e8130a14ad2ab77a193",
                        "name": "(h) bulots (kg) plateau ",
                        "price": 30,
                        "qty": 0.1,
                        "units": {
                            "name": "kilogramme",
                            "symbol": "kg"
                        }
                    },
                    {
                        "id": "262abc620c6740209c6e14ec",
                        "name": "(i) BIGORNEAUX (kg) plateau",
                        "price": 42,
                        "qty": 0.05,
                        "units": {
                            "name": "kilogramme",
                            "symbol": "kg"
                        }
                    },
                    {
                        "id": "b3b99ee019b143ef88ac0950",
                        "name": "(j) DEMI-LANGOUSTE plateau",
                        "price": 22.8,
                        "qty": 1,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "2f842f0db2cd4eebbb832d1e",
                        "name": "(l) HUITRES DE CANCALE N° 3 PLATEAU",
                        "price": 1.8,
                        "qty": 6,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "ad635095cdf04cd7836d530f",
                        "name": "(m) PALOURDE plateau",
                        "price": 1.2,
                        "qty": 1,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "8313edd39d544a8c902e7894",
                        "name": "(n) praire plateau",
                        "price": 1.2,
                        "qty": 1,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "1c3a1bcf62fd427e865f22fe",
                        "name": "(o) clams plateau",
                        "price": 6,
                        "qty": 1,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "21e39b4cfc05425c9e912aa6",
                        "name": "DEMI-TOURTEAU CUIT plateau",
                        "price": "12",
                        "qty": 1,
                        "units": {
                            "name": "pièce",
                            "symbol": "pc"
                        }
                    },
                    {
                        "id": "7f97851a1efb49df8b5adae3",
                        "name": "Mayonnaise",
                        "price": "0.01",
                        "qty": 80,
                        "units": {
                            "name": "gramme",
                            "symbol": "g"
                        }
                    }
                ];
            });
            await collection.replaceOne({ _id: doc._id }, doc);
            console.log(`Document mis à jour : ${doc._id}`);
          }


        return NextResponse.json(true);
    } catch (e) {
        console.error(e);
    }
}
