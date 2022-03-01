import { Prisma, PrismaClient } from "@prisma/client";

import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

const INGREDIENTS_START = {row: 3, column: 4};
const FINSIHED_DRINK_START = {row: 3, column: 1};

interface SimpleRequirement {
	requiredItem: string;
	parts: number;
}

interface SimpleIngredient {
	name: string;
	requirements: SimpleRequirement[];
}

async function main() {
	await prisma.$connect();


	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.readFile("default-drinks.xlsx");
	const worksheet = workbook.getWorksheet("Ark1");

	let simpleIngredients: SimpleIngredient[] = [];

	for (let i = INGREDIENTS_START.row;;i++) {
		let row = worksheet.getRow(i);
		let name = row.getCell(INGREDIENTS_START.column).value;
		if (name == null) {
			break;
		}

		let requirements: SimpleRequirement[] = [];
		for (let j = INGREDIENTS_START.column + 1;;j++) {
			let requirement = row.getCell(j).value;
			if (requirement == "$" || requirement == null) {
				break;
			} else {
				let [parts, requiredItem] = requirement.toString().split(";");

				let parsed = Number.parseInt(parts);
				if (Number.isNaN(parsed)) {
					throw new Error(`wrongly formatted requirement at row ${i} column ${j}`);
				}
				requirements.push({requiredItem: requiredItem, parts: parsed});
			}
		}
		simpleIngredients.push({
			name: name.toString(),
			requirements: requirements
		});
	}

	for (let ingredient of simpleIngredients) {
		let created_ingredient = await prisma.ingredient.create({
			data: {
				name: ingredient.name
			}
		});
		for (let requirement of ingredient.requirements) {
			//find the required item
			let required_item = await prisma.ingredient.findUnique({
				where: {
					name: requirement.requiredItem
				}
			});
			if (required_item == null) {
				throw new Error("Missing required item from list " + requirement.requiredItem);
			}
			
			await prisma.ingredientRequirement.create({
				data: {
					parts: requirement.parts,
					requiresId: required_item.id,
					requiredForId: created_ingredient.id
				}
			});
		}
	}

	for (let i = FINSIHED_DRINK_START.row;;i++) {
		let row = worksheet.getRow(i);
		let name = row.getCell(FINSIHED_DRINK_START.column).value;
		if (name == null) {
			break;
		}
		
		let description = row.getCell(FINSIHED_DRINK_START.column +1 ).value;
		if (description == null) {
			description = "";
		}
		let ingredient = await prisma.ingredient.findUnique({
			where: {
				name: name.toString()
			}
		});

		if (ingredient == null) {
			throw new Error("Unknown ingredient " + name);

		}

		await prisma.finishedDrink.create({
			data: {
				description: description.toString(),
				ingredientId: ingredient.id
			}
		});
		
	}
}

main();