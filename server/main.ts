import { Prisma, PrismaClient } from "@prisma/client";
import ExcelJS from 'exceljs';
import koa from "koa"
import { ServiceNetwork } from "koa-blocks/ServiceNetwork";
import { MemoryStore, SessionService } from "koa-blocks/services/SessionService";
import bodyParser from "koa-bodyparser"
import Router from "@koa/router";
import SearchController from "./controllers/search-controller";
import EJSRenderer from "./services/EJSRenderer";
import * as path from "path";

async function main() {
	console.log("Connecting to database");

	const prisma = new PrismaClient();
	await prisma.$connect();

	console.log("Creating app");
	
	const app = new koa();
	const services = new ServiceNetwork();
	
	const main_router = new Router();

	services.add_service(SessionService, new SessionService({
		key: "phpsessid",
		expires: 1000 * 60 * 60 * 24
	}, new MemoryStore()));

	services.add_service(EJSRenderer, new EJSRenderer(path.join(__dirname, "views"), false));

	app.use(async (ctx, next) => {
		console.log(ctx.url);
		await next();
	});

	app.use(bodyParser());
	app.use(async (ctx, next) => {
		await next();
	})
	for (let middleware of services.create_middleware()) {
		app.use(middleware);
	}

	let search_controller = new SearchController(services);

	main_router.use(search_controller.get_routes());

	app.use(main_router.routes());

	app.listen(8000, () => {
		console.log("Now listening");
	});
}

main();