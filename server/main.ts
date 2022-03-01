/*async function main() {
	console.log("Connecting to database");

	const prisma = new PrismaClient();
	await prisma.$connect();

	console.log("Creating app");
	
	const app = new koa();
	const services = new ServiceNetwork.ServiceNetwork();
	
	const main_router = new Router();

	services.add_service(SessionService, new SessionService({
		key: "phpsessid",
		expires: 1000 * 60 * 60 * 24
	}, new MemoryStore()));

	services.add_service(HBSViews, new HBSViews(join(__dirname, "views/"), false));
	services.add_service(EJSRenderer, new EJSRenderer(join(__dirname, "views/"), false));

	services.add_service(AuthenticationService, new AuthenticationService<User>(services, {
		get_by_id: async (id: number) => {
			return await prisma.user.findUnique({
				where: {
					id: id
				}
			});
		}
	}, {
		algorithm: Algorithm.PBKDF2,
		rounds: 50000,
		salt_length: 16,
		digest: "sha512",
		encodings: ["base64", "hex"],
		preferred_encoding: "base64",
		keylen: 64
	}));

	services.add_service(UserService, new UserService(services, prisma));
	services.add_service(DocumentService, new DocumentService(services, prisma));
	

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

	let main_controller = new MainController(services);
	let api_controller = new EditorAPIController(services);
	let user_api_controller = new UserAPIController(services);
	
	main_router.use(main_controller.get_routes());
	main_router.use(api_controller.get_routes());
	main_router.use(user_api_controller.get_routes());

	app.use(main_router.routes());

	app.use(koa_mount("/static", koa_static(path.join(__dirname, "public"))));

	app.listen(8000, () => {
		console.log("Now listening");
	});
}

main();*/