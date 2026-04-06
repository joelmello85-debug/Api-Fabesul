const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

// --- Utils: Normalization ---
/**
 * Normaliza o texto removendo acentos, caracteres especiais e convertendo para minúsculas.
 * @param {string} text 
 * @returns {string}
 */
function normalizeText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s]/g, "")     // Remove caracteres especiais
    .trim();
}

// --- DB Setup ---
const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new Database(dbPath);

const productsData = "30.076\tCafé 500G Tradicional Melitta Pouch\t\tPT\t37,47\n" +
"31.918\tPapel Chamex 210X297 75G Branco A4 Pc C/500 Fls\t\tPC\t23,23\n" +
"31.423\tPapel Magnum 210x297 A4 75g c/ 500 Fls. Branco Sulfite\t\tPT\t23,03\n" +
"26.369\tCopo Plástico 180Ml C/100Un Br Rosso Abnt (Ps)\t\tCT\t3,69\n" +
"29.867\tPilha Palito AAA Alcalina C/2 Un Bl2 Fiat Lux\t\tCJ\t5,22\n" +
"31.125\tApoio P/Pés Ergonômico Regulagem Altura Mdf 26X39X11 Ref3704\t\tUN\t64,35\n" +
"29.293\tBateria (Pilha) 9V Alcalina Elgin Unidade 6Lr61\t\tUN\t12,77\n" +
"1.431\tFita Rotulador Eletrônico 12mm Preto/Branco M231 Brother\t\tUN\t78,07\n" +
"32.013\tPapel Branco 210X297 A4 Pt C/500 Fls\t\tPC\t23,03\n" +
"31.357\tApoio P/Mouse Pad Punho Gel Preto Bright 0307\t\tUN\t29,75\n" +
"21.460\tAçúcar Saco C/ 1 Kg Refinado Alto Alegre\t\tUN\t5,62\n" +
"29.803\tSuporte Para Notebook Regulável Ac578\t\tUN\t37,96\n" +
"28.005\tCaneta Esferog. Azul Compactor Economic 1987001\t\tUN\t0,66\n" +
"16.875\tFita Empacotamento 45X40M Transp.Nh Fugy/Fabesul 40Micras\t\tRL\t3,71\n" +
"18.177\tPorta Chaves P/24 Chaves C/Chav.Acrimet161.0/300X370X50mmmdf\t\tUN\t287,05\n" +
"17.649\tPapel Report 210X297 75G Br A4 Pt C/500 Fls Premium\t\tPT\t23,03\n" +
"19.081\tArquivo Morto 344/13,5/244mm Pequeno Bragagnolo\t\tUN\t2,73\n" +
"21.092\tElástico Amarelo N18 50G Redbor (Atilho)\t\tPT\t1,95\n" +
"27.015\tErva Mate 1Kg Ximango Tradicional A Vácuo\t\tKG\t17,84\n" +
"22.286\tPasta Preta Nugget 36G Ref. 00243\t\tUN\t19,37\n" +
"16.855\tElástico Amarelo N18 50G Fulgor (Atilho)\t\tPT\t1,80\n" +
"18.625\tCafé 500G Extra Forte Três Corações Vácuo 12031213\t\tPT\t39,39\n" +
"30.637\tSuporte Para Notebook E Monitor Preto Ref.10090007 Waleu\t\tUN\t49,90\n" +
"29.869\tPilha Peq. AA Alcalina C/2 Un Bl2 Fiat Lux\t\tCJ\t5,18\n" +
"14.000\tCafé 500G Extra Forte Melitta Vácuo 793-1\t\tPT\t22,10\n" +
"27.338\tGrampeador Mp300 Metal P/Ate 20 Fls Peq. 11,5Cm Masterprint\t\tUN\t14,32\n" +
"18.360\tFiltro P/Café N.103 Grande Cx C/30 Unidades Brigitta\t\tPT\t5,27\n" +
"29.583\tGrampo 26/6 Cx C/5000 Galvanizado Brw\t\tCX\t5,15\n" +
"30.148\tApoio P/ Pulso Teclado Ergonômico Bright Ref. 556\t\tUN\t38,51\n" +
"30.140\tTesoura 21 Cm De Aço Inox Ref. Te2101 Brw\t\tUN\t7,26\n" +
"20.475\tPrancheta Duratex Of. C/Prendedor Metal Bacchi 32010\t\tUN\t6,47\n" +
"28.736\tOrganizador De Esc.P/Parede/Mesa cristal Acrimet864.0Vertical\t\tUN\t88,11\n" +
"25.818\tCaneta Corpo/Suporte/Corrente Em Aluminio Pratic AZ Ref. 226 Merini\t\tUN\t21,92\n" +
"28.129\tCaneta Esferog. Preta Compactor Economic 1987004\t\tUN\t0,66\n" +
"29.292\tPilha 12V Controle Garagem/Alarme Carro A23 Alcalina Elgin\t\tUN\t3,59\n" +
"30.677\tBloco Anotação 38X51mm Am C/4Bl 100F Auto Adesivos Ba3801Brw\t\tBL\t5,39\n" +
"31.010\tPasta Sanfona 12 Div. A4 Cristal 090717\t\tUN\t15,09\n" +
"29.960\tCola Em Bastão 09G Frama Ref. 468\t\tUN\t1,06\n" +
"22.959\tCorretivo Em Fita Roller 5mmx6M Maxprint Ref. 70566-2\t\tUN\t4,30\n" +
"28.870\tMarcador P/Quadro Branco Preto Brw Ca3002\t\tUN\t2,50\n" +
"31.490\tRotulador Eletrônico PTM95BK Preto Brother\t\tUN\t301,59\n" +
"12.309\tFita Dupla Face 24mmx30M Adelbras\t\tRL\t9,83\n" +
"29.900\tChaveiros E Etiquetas Acrimet C/24 Chav.Sortido R.141\t\tPT\t37,83\n" +
"1.902\tCola Branca 90G Maxi Cola Lavável Não Toxica Ref. 441\t\tUN\t1,63\n" +
"2.556\tFita Dupla Face 12mmx30M Polipropileno Sicad\t\tRL\t7,05\n" +
"10.788\tGrampo 23/6 Cx C/1000 Galvanizado Acc 92411116\t\tCX\t6,69\n" +
"18.427\tFita Dupla Face 12mmx2M Fixa Forte 3M HB004419873\t\tRL\t16,23\n" +
"25.804\tCaixa Correspondência 2 Andares Cr Articulável 3043H0006\t\tUN\t36,97\n" +
"16.051\tCaderno Univ. 96F 01 Mat. Espiral Paisagem3056/Sortido\t\tUN\t8,19\n" +
"27.467\tExpositor Classic 862 Cristal Horizontal Acrimet\t\tUN\t36,45\n" +
"26.484\tClips 8/0 Cx C/170Un Linha Leve Bacchi Galvanizado 1110-7\t\tCX\t13,74\n" +
"26.864\tImã P/Quadro Magnético 17mm Diam. Preto C/12Un\t\tPC\t20,67\n" +
"21.299\tDetergente Líquido 500Ml Neutro Ype\t\tUN\t4,22\n" +
"28.869\tMarcador P/Quadro Branco Azul Brw Ca3001\t\tUN\t2,50\n" +
"28.872\tMarcador P/Quadro Branco Vermelho Brw Ca3003\t\tUN\t2,50\n" +
"30.592\tPapel Chamex 210X297 75G Azul C/500Fls\t\tPC\t29,31\n" +
"25.387\tMarcador De Pagina 76X15mm Post-It Flags papel 180F HB004420657\t\tBL\t11,06\n" +
"25.751\tCola Bond 3G Scotch 3M HB004024202\t\tUN\t5,78\n" +
"29.909\tMarcador Cd/Dvd Az Retroprojetor Ponta Dup 0,4E2mmca5012Brw\t\tUN\t2,66\n" +
"31.204\tApoio P/Mouse Pad Punho Gel Preto Smart Ref. 60000097\t\tUN\t37,39\n" +
"20.796\tPost-It 76X76mm Pop-Up R330 Am C/4 Blocos C/100 Fls L4P3 HB004130074\t\tPT\t31,75\n" +
"12.307\tFita Dupla Face 12mmx30M Polipropileno Adelbras\t\tRL\t6,14\n" +
"30.970\tOrganizador De Mesa Aramado Prata Quadrado 3 Compart. Or5122\t\tUN\t30,07\n" +
"29.308\tPilha Peq. AA Recarreg. Elgin C/2Un 2500 Mah - 82172\t\tCJ\t31,38\n" +
"32.125\tCalculadora 12 Dig Zeta ZT712\t\tUN\t26,19\n" +
"21.324\tFita Crepe 18X50M Branca Adelbras Ro56 Mask\t\tRL\t4,95\n" +
"13.312\tPost-It 76X76mm Ref. 654 Notefix C/100F Am HB004088694\t\tUN\t5,09\n" +
"30.679\tBloco Anotação 76X102mm Am C/100F Auto Adesivos Ba7501 Brw\t\tBL\t4,67\n" +
"26.481\tClips 3/0 Cx C/450Un Linha Leve Bacchi Galvanizado 11077\t\tCX\t14,19\n" +
"31.232\tMarca Texto Verde Needs Maxprint\t\tUN\t1,07\n" +
"31.231\tMarca Texto Amarelo Needs Maxprint\t\tUN\t1,07\n" +
"32.308\tCorretivo Em Fita Roller 5mmx6M Maxprint Ref. 70566-2\t\tUN\t4,30\n" +
"26.951\tAçúcar Saches C/5 Gr Cristal Premium Caravelas Cx C/1000 Un\t\tCX\t46,62\n" +
"20.376\tAçúcar Saco C/ 5 Kg Cristal Alto Alegre\t\tUN\t27,33\n" +
"16.720\tSaco Plástico 24X32,5X012 S/Furo Of C/100U Acp 012/100/Sf\t\tPT\t33,46\n" +
"18.602\tExtrator De Grampo Tipo Espátula Zincado\t\tUN\t1,68\n" +
"27.237\tSuporte Para Notebook Cooler Table Vertical Ref. Ac166\t\tUN\t96,96\n" +
"29.309\tKit Teclado/Mouse S/Fio Wireless Preto Mk235 Logitech\t\tUN\t183,67\n" +
"28.223\tInseticida 285Ml Aerossol Base Água Baygon Múltiplus Johnson\t\tUN\t14,63\n" +
"28.244\tArquivo Morto 340/130/240mm Pequeno Bragagnolo Reciclado\t\tUN\t2,80\n" +
"4.503\tPasta Catálogo C/10 Sacos 0,06 C/4 Colchetes S/Visor 121\t\tUN\t9,02\n" +
"12.553\tCola Em Bastão 20G 3M HB004556872\t\tUN\t9,23\n" +
"26.480\tClips 2/0 Cx C/720Un Linha Leve Bacchi Galvanizado 11060\t\tCX\t14,19\n" +
"24.087\tPilha Peq. AA Alcalina Elgin C/2 Un Lr6 - 82152\t\tCJ\t5,18\n" +
"27.723\tKit Teclado/Mouse S/Fio Wireless Preto Mk220 Logitech\t\tUN\t163,02\n" +
"21.604\tCadeado Pado 20 mm\t\tUN\t15,71\n" +
"31.233\tMarca Texto Rosa Needs Maxprint\t\tUN\t1,07\n" +
"22.165\tGarrafa Térmica 1,8L Pressão Preta Termolar 8709\t\tUN\t73,78\n" +
"1.506\tCaneta Esferog. Azul Bic Cristal Ref. 835205\t\tUN\t0,94\n" +
"12.466\tApagador P/Quadro Branco Plástico Tonbras Radex\t\tUN\t6,71\n" +
"2.220\tEnvelope Kraft Natural 20,0 X 28,0 80G Skn28 Scrity\t\tCT\t36,00\n" +
"27.337\tEstilete Largo 18mm Plástico Mp451 Masterprint\t\tUN\t1,53\n" +
"28.130\tCaneta Esferog. Vermelha Compactor Economic 1987002\t\tUN\t0,64\n" +
"27.620\tClips 6/0 Cx C/50Un Linha Leve Bacchi Galvanizado 09098\t\tCX\t2,81\n" +
"30.081\tMarcador Permanente Preto Ponta Chanfrada Ca4002 Brw\t\tUN\t2,10\n" +
"31.235\tMarca Texto Laranja Needs Maxprint\t\tUN\t1,07\n" +
"26.866\tImã P/Quadro Magnético 17mm Diam. Azul C/12Un\t\tPT\t19,05\n" +
"26.541\tCavalete P/Bloco Flip Chart 1.80M Madeira Souza Ref. 2523\t\tUN\t114,19\n" +
"27.422\tBloco Meio Oficio Rascunho Liso C/50F Tam 140X202mm Ref.5013\t\tBL\t2,58\n" +
"28.665\tEsponja Df Scotch Brite 75X110mm C/10Un Verde/Am H0001457037\t\tPT\t13,48\n" +
"24.127\tMouse Usb Preto Ótico Espanha Ref. 0106 Bright\t\tUN\t14,27\n" +
"24.074\tCaixa Correspondência 3 Andares Cristal Fixa Acrilico Maxcril 10050015\t\tUN\t52,57\n" +
"24.367\tPasta Aba Elástico Polipropileno Azul Lombo 4Cm\t\tUN\t4,78\n" +
"29.313\tPasta Aba Elástico Duplex 120Gr Preta Ref. 295-248\t\tUN\t2,37\n" +
"24.187\tPost-It 76X76mm Pop-Up R330 Laranja C/90F HB004309652\t\tUN\t10,92\n" +
"20.701\tTinta Para Carimbo Radex Preto 40ML\t\tUN\t4,03\n" +
"25.806\tExpositor Cristal Dello 3054H0006\t\tUN\t32,22\n" +
"10.745\tPasta L OF New LineTransparente Polibras Ref. 93117\t\tUN\t0,74\n" +
"19.797\tOrganizador De Gavetas Preto 240X265X25 3004 Dello\t\tUN\t18,02\n" +
"23.025\tMexedor 11,0Cm Transparente C/240Un Msg 801/364 (Palheta)\t\tPT\t11,94\n" +
"12.099\tCaneta Hidrocor Neo Pen Azul Gigante Compactor 73001\t\tUN\t1,11\n" +
"3.427\tLápis De Cor C/36Un Inteiro Eco lápis Linha Verm 120136Gfaber\t\tCX\t80,70\n" +
"29.606\tFita Empacotamento 45X100M 3M TR Scotch 5802 Hotmelt HB004640734\t\tRL\t11,42\n" +
"19.778\tEnvelope Kraft Natural 22,9 X 32,4 80G Ref. 1033 Foroni\t\tCT\t33,00\n" +
"16.325\tMarcador P/Quadro Branco C/4Cores Az/Pr/Vm/Vd Recarreg.Wbm7\t\tES\t37,58\n" +
"12.100\tCaneta Hidrocor Neo Pen Preto Gigante Compactor 73004\t\tUN\t1,11\n" +
"30.539\tKit Porta Detergente 600Ml Pt Quadrado 13970 Plasutil\t\tUN\t24,22\n" +
"26.021\tRégua 30Cm Plástica Cristal Estreita Waleu 10270012\t\tUN\t1,04\n" +
"24.121\tBateria (Pilha) 3V Elgin Cr2032 C/1 Un R.82193 P/Calc.Hp12C\t\tUN\t1,76\n" +
"28.871\tMarcador P/Quadro Branco Verde Brw Ca3004\t\tUN\t2,50\n" +
"5.428\tEtiqueta Carta Pimaco 25,4X66,7 C/100F 3000Et 6180\t\tCR\t62,25\n" +
"30.317\tBarbante De Algodão Cru 8 Fios Rolo C/250G 184m\t\tRL\t10,97\n" +
"31.432\tConversor VGA P/ HDMI Bright Ref. AC591 SD\t\tUN\t60,94\n" +
"16.719\tSaco Plástico 24X32,5X006 C/4Furos Of C/100U Acp 06/100/4F\t\tPT\t16,14\n" +
"4.305\tPasta Az C/Pvc Ll Tigr. Of. Usual Miolo Pvc 356-780 Frama\t\tUN\t12,54\n" +
"29.655\tPasta Aba Elástico Duplex 120Gr Azul Royal Shine 295-73\t\tUN\t2,37\n" +
"24.739\tPerfurador 2 Furos Metal Mx-P10C P/10Fls R.71447-0\t\tUN\t9,45\n" +
"22.974\tLacre P/Malote 16Cm C/100Un Azul ILQ16 Iso Lacres\t\tCT\t14,00\n" +
"15.870\tEsponjeira Molha Dedo 12G Em Pasta Asuper Radex Aqua Magic\t\tUN\t2,71\n" +
"16.516\tCafé 500G Tradicional Bom Jesus A Vácuo\t\tPC\t27,31\n" +
"16.874\tFita Empacotamento 45X40M Havana Nh Fugyama 40Mic\t\tRL\t3,76\n" +
"30.139\tCorretivo Em Fita 5mmx6M Ref. 91211 Jocar\t\tUN\t3,96\n" +
"1.509\tCaneta Ponta Fina Azul Bic Fine Plus- Ref.856432\t\tUN\t0,98\n" +
"2.217\tEnvelope Kraft Natural 26,0 X 36,0 80G Skn36 Scrity\t\tCT\t35,00\n" +
"24.321\tBloco Lembrete Marfim Filicube Reciclado 90G 650Fls\t\tBL\t16,29\n" +
"30.575\tFiltro Linha 5 Tomadas Bivolt Pt Protetor Eletr. Epe205Pt\t\tUN\t48,67\n" +
"27.381\tCaixa Correspondência 3 Andares Cristal Articulavel3044H0004\t\tUN\t48,45\n" +
"1.507\tCaneta Esferog. Preta Bic Cristal - Ref. 835208\t\tUN\t0,95\n" +
"1.908\tCola Super Bonder 3G Henkel\t\tUN\t5,78\n" +
"15.411\tBloco Flip Chart C/ 50 Fls. 63x80 56G São Domingos Ref.10032\t\tUN\t44,44\n" +
"30.049\tFita Adesiva 12X30M Cristal Sicad Pp 2000 Tubete Peq. Eurocel\t\tRL\t1,10\n" +
"29.253\tPasta C/Grampo Plástico Tipo Probus Azul 335-73\t\tUN\t1,73\n" +
"28.538\tPorta Caneta Cristal Dellocolor 3029H0012\t\tUN\t7,24\n" +
"22.398\tPOST-IT FLAGS 680-YW2 AMARELO 3M C/100FLS HB004193502 SD\t\tBL\t20,45\n" +
"24.538\tPasta Sanfona 31 Div. A4 Azul Plastica Ref 91509 SM\t\tUN\t38,83\n" +
"27.463\tLapiseira 0.9mm Técnica Amarela Maxprint R.709247\t\tUN\t4,42\n" +
"9.829\tFlanela 28X38Cm Branca\t\tUN\t1,40\n" +
"27.619\tClips 4/0 Cx C/50Un Linha Leve Bacchi Galvanizado 09081\t\tCX\t2,17\n" +
"15.042\tFita Dupla Face 12mmx30M Polipropileno Ref. 4873 Bopp 3M HB004117485\t\tRL\t17,95\n" +
"31.474\tLapiseira 0.7mm BRW Ref.LP0711 Pastel Clip Transp/Cores Sortidas\t\tUN\t1,97\n" +
"12.314\tFita Crepe 12X50M Branca Adelbras\t\tRL\t3,32\n" +
"30.206\tAgenda Preta 2025 Pepper Espiral M4 11,7X16,4Cm. 179698\t\tUN\t16,51\n" +
"13.311\tPost-It 76X102mm Ref. 657 NFX7 Notefix C/100F Am HB004088702\t\tBL\t4,67\n" +
"24.139\tTeclado Usb Preto Ref.0014 Bright\t\tUN\t32,18\n" +
"21.113\tBloco Lembrete Colorido Filicube 86X86X80 650 Fls - 0763\t\tBL\t15,82\n" +
"16.695\tRefil P/Marcador Quadro Br Preto Wbma Wbs-Vbm Board Master\t\tUN\t5,48\n" +
"21.723\tCola Colorida 23G Acrilex C/6 Cores Ref. 02606\t\tCJ\t15,30\n" +
"29.878\tFita Adesiva 12X30M Transparente Qualitape Tubete 1 Pequeno\t\tUN\t1,10\n" +
"16.154\tGrampo 9/10=23/10 Cx C/5000 P/Rapid 9 Bacchi 21571\t\tCX\t27,28\n" +
"11.423\tBorracha Mercur Escolar 60 Branca\t\tUN\t0,46\n" +
"3.327\tGrafite 0,7mm 2B Big Tree 1891000\t\tTB\t1,40\n" +
"12.387\tEtiqueta Carta Pimaco 12,7X44,45 6087 C/10F 800Et\t\tCR\t12,51\n" +
"30.209\tApontador Plástico C/Reservatório Brw Retangular Neon Ap2022\t\tUN\t1,45\n" +
"18.185\tEtiqueta Adesiva Pimaco A4255 25Fls 31,0X63,5\t\tCR\t24,61\n" +
"31.724\tCalculadora 12 Dig De Mesa Moure Jar MJ-3851B\t\tUN\t24,14\n" +
"25.660\tPost-It 76X76mm Pop-Up Azul Céu Refil C/90Fls Puxa Fácil HB004312573\t\tUN\t11,85\n" +
"23.955\tEsponja Multiuso Leve4Pague3 Brilhus Ref.Bt4514 Bettanin\t\tPT\t4,41\n" +
"5.454\tEtiqueta Carta Pimaco 33,9X101,6 6282 C/25F 350Et\t\tUN\t21,89\n" +
"26.713\tPapel Foto 180G C/50Fls A4 210X297mm Masterprint\t\tPC\t21,89\n" +
"14.730\tGrampeador Peq. Plástico A17 Preto P/20F Maped R.953511\t\tUN\t21,88\n" +
"13.310\tPost-It 38X50mm C/4Bl 100F Ref. 653 Notefix Am HB004088686\t\tUN\t5,39\n" +
"10.192\tDivisória C/10 Posições Plástica Coloridas 22,5X29,7 Acp 755\t\tCJ\t5,15\n" +
"31.128\tCaixa Correspondência Simples De Madeira N.1 Pinus Ref. 3421\t\tUN\t20,30\n" +
"27.565\tGiz De Cera C/6 Cores Koala Delta Ref. 002253\t\tCX\t1,97\n" +
"21.158\tLápis Grafite N2 Hb Leo&Leo Redondo Ref. 4691 Corpo Pt\t\tUN\t0,29\n" +
"32.159\tFita Adesiva 12X30M Transp. Tubete Pequeno R.1014 Inoven\t\tRL\t1,19\n" +
"2.118\tCorretivo Líquido 18Ml A Base D´Agua Maxi Frama 478\t\tUN\t1,77\n" +
"3.605\tMarcador P/Quadro Branco Vermelho Recarregável Wbm7 Pilot\t\tUN\t8,72\n" +
"3.607\tMarcador P/Quadro Branco Azul Recarregável Wbm7 Pilot\t\tUN\t8,72\n" +
"3.608\tMarcador P/Quadro Branco Preto Recarregável Wbm7 Pilot\t\tUN\t8,72\n" +
"23.792\tTesoura 13,5 Cm Cis Office Ts779 Revest. Capa Plast. 2407700\t\tUN\t8,33\n" +
"30.082\tMarcador Permanente Vermelho Ponta Chanfrada Ca4003 Brw\t\tUN\t2,10\n" +
"17.054\tGrafite 0,9mm 2B Big Tree Sertic 1891300\t\tTB\t1,70\n" +
"30.080\tMarcador Permanente Azul Ponta Chanfrada Ca4001 Brw\t\tUN\t2,10\n" +
"8.613\tPost-It 38X50mm C/4Bl 100F Ref. 653 Amarelo 3M HB004088165\t\tPT\t13,76\n" +
"30.275\tPasta Aba Elástico Duplex 250G Vermelha Dello 0199U0050\t\tUN\t4,58\n" +
"31.833\tMexedor de Madeira (Pinus) 9cm C/200Un Mexabem (Palheta) LMEXM001\t\tPC\t6,87\n" +
"10.305\tCaneta Borracha Mercur Branca C/1 Refil Sortidas\t\tUN\t6,76\n" +
"24.106\tBateria (Pilha) 1,5V LR44/V13GA C/1 Un Alcalina Elgin 82194\t\tUN\t0,52\n" +
"21.060\tMarcador P/Quadro Branco Verde Wbma Pilot Board Master\t\tUN\t13,37\n" +
"22.540\tMarcador P/Quadro Branco Violeta Wbma Pilot Board Master\t\tUN\t13,37\n" +
"24.128\tMouse Usb Prata Ótico Espanha Ref. 0107 Bright\t\tUN\t13,32\n" +
"22.957\tEnvelope Br. 11,4 X 22,9 63G Of. S/Cep Coml Ref. 2011 Foroni\t\tCT\t12,00\n" +
"24.184\tPost-It 76X76mm Pop-Up R330 Limão C/90F Refil HB004309603\t\tPC\t11,86\n" +
"27.255\tMarcador P/Quadro Branco Vermelho 70917-5 Mark+Plus Maxprint\t\tUN\t2,30\n" +
"23.932\tPincel Atômico Bic Az (Marcador Permanente) Recar R.904385\t\tUN\t2,10\n" +
"23.933\tPincel Atômico Bic Pt (Marcador Permanente) Recar R.904386\t\tUN\t2,10\n" +
"18.359\tFiltro P/Café N.102 Médio Cx C/30 Unidades Brigitta\t\tPT\t5,05\n" +
"25.218\tCapa Pvc A4 210X297 Cristal Line 0,30 M\t\tUN\t0,48\n" +
"24.374\tPasta Aba Elástico Polipropileno Tr Lombo 4Cm 257H\t\tUN\t4,78\n" +
"3.301\tGrafite 0,5mm Hb Big Tree 1890200\t\tTB\t1,19\n" +
"30.990\tMarcador P/Retroprojetor Azul 2,0mm Ecowrite 70000091\t\tUN\t2,45\n" +
"31.520\tÁlcool Líq. 1L Etílico 46 Graus Bactericida Desinf.P/Uso Geral Baczero\t\tLT\t7,23\n" +
"26.683\tPresilha P/Crachá Ref. 801N Acp\t\tUN\t0,67\n" +
"29.582\tMarcador Permanente Verde Ponta Chanfrada 5.0 Ca4004 Brw\t\tUN\t2,13\n" +
"13.796\tCola Com Gliter 23G Acrilex Verde 206\t\tUN\t6,12\n" +
"14.922\tCaneta Hidrocor Neo Pen C/6 Un Gigante Compactor\t\tES\t5,64\n" +
"12.102\tCaneta Hidrocor Neo Pen Vermelha Gigante Compactor 73002\t\tUN\t1,11\n" +
"19.615\tPasta C/Grampo Trilho Past.. Cristal 1039Acp(Classificadora)\t\tUN\t2,75\n" +
"13.793\tCola Com Gliter 23G Acrilex Prata 202\t\tUN\t5,20\n" +
"13.795\tCola Com Gliter 23G Acrilex Vermelho 205\t\tUN\t5,20\n" +
"13.792\tCola Com Gliter 23G Acrilex Ouro 201\t\tUN\t4,69\n" +
"26.521\tRégua 30Cm Plástica Leitosa Colorida Waleu 10270013\t\tUN\t0,96\n" +
"18.538\tEstilete Largo 18mm Plástico Colorido Jocar Ref. 91411\t\tUN\t1,41\n" +
"6.106\tApontador Plástico Redondo Sortido Sertic Importado 2406400\t\tUN\t1,34\n" +
"10.571\tRefil Caneta Borracha Mercur Branco Ref BO10101001 SM\t\tUN\t2,57\n" +
"31.878\tLapiseira 0.5mm Bic Plástica Shimmers  Ref.891944\t\tUN\t2,21\n" +
"8.012\tLapiseira 0.7mm Bic Plástica Shimmers - Ref.891946\t\tUN\t2,14\n";

function initDb() {
  db.exec("CREATE TABLE IF NOT EXISTS produtos (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "codigo TEXT, " +
    "descricao TEXT, " +
    "descricao_normalizada TEXT, " +
    "unidade TEXT, " +
    "preco REAL" +
  ")");

  db.exec("CREATE TABLE IF NOT EXISTS sinonimos (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "termo TEXT, " +
    "termo_normalizado TEXT, " +
    "produto_id INTEGER, " +
    "FOREIGN KEY (produto_id) REFERENCES produtos(id)" +
  ")");

  const row = db.prepare("SELECT COUNT(*) as count FROM produtos").get();
  if (row && row.count === 0) {
    console.log("Populando banco de dados inicial...");
    const lines = productsData.trim().split("\n");
    const insertStmt = db.prepare("INSERT INTO produtos (codigo, descricao, descricao_normalizada, unidade, preco) VALUES (?, ?, ?, ?, ?)");
    
    const transaction = db.transaction((lines) => {
      for (const line of lines) {
        const parts = line.split("\t").filter(p => p.trim() !== "");
        if (parts.length >= 4) {
          const codigo = parts[0].trim();
          const descricao = parts[1].trim();
          const unidade = parts[parts.length - 2].trim();
          const preco = parseFloat(parts[parts.length - 1].replace(",", "."));
          insertStmt.run(codigo, descricao, normalizeText(descricao), unidade, preco);
        }
      }
    });

    transaction(lines);
    console.log("Produtos inseridos. Gerando sinônimos automáticos...");
    generateAutoSynonyms();
  }
}

function generateAutoSynonyms() {
  const basicSynonyms = [
    { key: "perfex", search: "esponja" },
    { key: "qboa", search: "detergente" },
    { key: "qboa", search: "alcool" },
    { key: "papel a4", search: "papel" },
    { key: "caneta azul", search: "caneta" },
    { key: "bombril", search: "esponja" },
    { key: "durex", search: "fita" }
  ];

  const insertSynStmt = db.prepare("INSERT INTO sinonimos (termo, termo_normalizado, produto_id) VALUES (?, ?, ?)");
  const selectProdStmt = db.prepare("SELECT id FROM produtos WHERE descricao_normalizada LIKE ?");

  for (const syn of basicSynonyms) {
    const termNorm = normalizeText(syn.search);
    const rows = selectProdStmt.all("%" + termNorm + "%");
    if (rows) {
      for (const row of rows) {
        insertSynStmt.run(syn.key, normalizeText(syn.key), row.id);
      }
    }
  }
}

initDb();

// --- Controllers ---
const productController = {
  getAllProducts: (req, res) => {
    try {
      const rows = db.prepare("SELECT id, codigo, descricao, unidade, preco FROM produtos").all();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createProduct: (req, res) => {
    try {
      const { codigo, descricao, unidade, preco } = req.body;
      const descricao_normalizada = normalizeText(descricao);
      const info = db.prepare("INSERT INTO produtos (codigo, descricao, descricao_normalizada, unidade, preco) VALUES (?, ?, ?, ?, ?)")
        .run(codigo, descricao, descricao_normalizada, unidade, preco);
      res.json({ id: info.lastInsertRowid, codigo, descricao, unidade, preco });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createSynonym: (req, res) => {
    try {
      const { termo, produto_id } = req.body;
      const termo_normalizado = normalizeText(termo);
      const info = db.prepare("INSERT INTO sinonimos (termo, termo_normalizado, produto_id) VALUES (?, ?, ?)")
        .run(termo, termo_normalizado, produto_id);
      res.json({ id: info.lastInsertRowid, termo, produto_id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  searchProducts: (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const termNorm = normalizeText(query);

    const sql = "WITH search_results AS (" +
      "SELECT p.*, 3 as relevancy FROM produtos p JOIN sinonimos s ON p.id = s.produto_id WHERE s.termo_normalizado = ? " +
      "UNION ALL " +
      "SELECT p.*, 2 as relevancy FROM produtos p JOIN sinonimos s ON p.id = s.produto_id WHERE s.termo_normalizado LIKE ? AND s.termo_normalizado != ? " +
      "UNION ALL " +
      "SELECT p.*, 1 as relevancy FROM produtos p WHERE p.descricao_normalizada LIKE ?" +
      ") " +
      "SELECT id, codigo, descricao, unidade, preco, MAX(relevancy) as score FROM search_results GROUP BY id ORDER BY score DESC, descricao ASC";

    const params = [
      termNorm,
      "%" + termNorm + "%", termNorm,
      "%" + termNorm + "%"
    ];

    try {
      const rows = db.prepare(sql).all(params);
      const results = rows.map(row => {
        const { score, descricao_normalizada, ...rest } = row;
        return rest;
      });
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

// --- Routes ---
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/produtos", productController.getAllProducts);
app.post("/produtos", productController.createProduct);
app.post("/sinonimos", productController.createSynonym);
app.get("/buscar", productController.searchProducts);

// --- Start Server ---
app.listen(PORT, () => {
  console.log("API inteligente rodando em http://localhost:" + PORT);
});
