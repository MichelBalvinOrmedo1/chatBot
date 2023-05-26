const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
const fs = require("fs");

// Leer el archivo JSON
const data = fs.readFileSync("./prod.json");
const jsonData = JSON.parse(data);
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const { log } = require("console");

const flowPrecio = addKeyword(["2", "precio"])
  .addAnswer("*Estos son los productos disponibles*")
  .addAnswer(
    [
      `💲 Pollo Fresco por kg : S/. *${jsonData.precio.pollo_fresco}*`,
      `💲 Pollo Congelado por kg : S/. *${jsonData.precio.pollo_congelado}*`,
      `💲 Menudencia del pollo por kg : S/. *${jsonData.precio.menudencia}*`,
    ],
    {
      media:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKBSkuJJl7r6X-bvDlQdJT2hJg06dhbY9bnw&usqp=CAU",
    }
  )
  .addAnswer(["\n*3* Menú principal."],
  { capture: true },
  (ctx, flow ) => {
    if (ctx.body === '3') {
        flow.gotoFlow(flowPrincipal);// Devolver al flujo anterior
    } 

  },
  );
  const metodosPago = jsonData.metodo_pago;
  const respuestasPago = [];
  
  for (let i = 0; i < metodosPago.length; i++) {
    respuestasPago.push('💵  ➡️ *' + metodosPago[i] + '* \n');
  }
const flowPago = addKeyword(["3", "precio"]).addAnswer(
  respuestasPago
)
.addAnswer(
  [
    '*Marque una Opciones*',
    '*3* Para volver al menu principal'
  ],
  { capture: true },
  (ctx, flow ) => {
    if (ctx.body === '3') {
        flow.gotoFlow(flowPrincipal);// Devolver al flujo anterior
    } 

  },
)



const flowTipoPollo = addKeyword(["1", "tipo", "pollo"]).addAnswer(
  [
    "*Tenemos:*",
    "🐔 Pollo Fresco",
    "🐔 Pollo Congelado",
    "🐔 Menudencia del pollo",
    "\n*1* Para el precio.",
    "\n*2* Precio",
    "\n*3* Menú principal.",
  ],
  { capture: true },
  (ctx, flow ) => {
    if (ctx.body === '3') {
        flow.gotoFlow(flowPrincipal);// Devolver al flujo anterior
    } 

  },
  [flowPrecio],
);

const flowPrincipal = addKeyword(["hola", "ole", "alo"])
  .addAnswer(
    "🙌 ¡Hola! Bienvenido al chat de venta de *pollo al por mayor.* ¿En qué puedo ayudarte hoy?"
  )
  .addAnswer(
    [
      "*Elija una opción:* ",
      "👉 *1* Tipos de pollo",
      "👉 *2* Precio por tipo de pollo",
      "👉 *3* Métodos de pago",
      "👉 *4* Información adicional y servicios",
      "👉 *5* Procedimiento de compra y finalización",
    ],
    null,
    null,
    [flowTipoPollo, flowPrecio, flowPago]
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};
main();
