
import { PassiveService } from "koa-blocks/ServiceNetwork";
import { FinishedDrink, Prisma, PrismaClient } from "@prisma/client";

export interface FinishedDrinkDescription {

}

export default class DrinkSearchService extends PassiveService {
	prisma: PrismaClient
	constructor(prisma: PrismaClient) {
		super();
		this.prisma = prisma;
	}

	async search_by_name(query: string): Promise<FinishedDrinkDescription> {
		let ingredients = await this.prisma.ingredient.findMany({
			where: {
				name: {
					contains: query
				}
			}
		});

		return ingredients.map((ingredient) => {
			let finished_drink = ingredient.
		});

	}
}