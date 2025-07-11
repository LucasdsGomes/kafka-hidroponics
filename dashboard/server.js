"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var path = require('path');
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var app = express();
var PORT = 3000;
// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// gRPC setup
var PROTO_PATH = path.join(__dirname, '../proto/hidroponia.proto');
var packageDef = protoLoader.loadSync(PROTO_PATH);
var grpcObj = grpc.loadPackageDefinition(packageDef);
var client = new grpcObj.hidroponia.HidroponiaService('localhost:50051', grpc.credentials.createInsecure());
// Helper para obter estatísticas de um tópico
function obterEstatisticas(topico) {
    return new Promise(function (resolve, reject) {
        client.CalcularEstatisticas({ topico: topico, leituras: [] }, function (err, res) {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
}
app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, stats01, stats02, stats03, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.all([
                        obterEstatisticas('HIDROPONIA01'),
                        obterEstatisticas('HIDROPONIA02'),
                        obterEstatisticas('HIDROPONIA03')
                    ])];
            case 1:
                _a = _b.sent(), stats01 = _a[0], stats02 = _a[1], stats03 = _a[2];
                res.render('index', {
                    estatisticas: {
                        HIDROPONIA01: stats01,
                        HIDROPONIA02: stats02,
                        HIDROPONIA03: stats03
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                res.status(500).send('Erro ao obter estatísticas.');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(PORT, function () {
    console.log("\uD83C\uDF10 Dashboard rodando em http://localhost:".concat(PORT));
});
