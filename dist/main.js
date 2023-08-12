"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
function bootstrap() {
    core_1.NestFactory.create(app_module_1.AppModule).then((app) => {
        app.enableCors({ origin: '*' });
        app.listen(process.env.PORT || 3000);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map