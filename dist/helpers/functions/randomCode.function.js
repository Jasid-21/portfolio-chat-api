"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomCode = void 0;
function randomCode(num = 20) {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = lower.toUpperCase();
    const numbers = '0123456789';
    const total = lower + upper + numbers;
    let code = '';
    for (let i = 0; i < num; i++) {
        const index = Math.floor(Math.random() * (total.length - 1));
        const l = total[index];
        code += l;
    }
    return code;
}
exports.randomCode = randomCode;
//# sourceMappingURL=randomCode.function.js.map