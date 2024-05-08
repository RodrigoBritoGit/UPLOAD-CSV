import readline from "readline";
import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Readable } from "stream";
import multer from "multer";
import cors from "cors";

const express = require("express");
const app = express();
const router = Router();
const prisma = new PrismaClient();
router.use(express.json()); // Middleware para fazer o parsing do corpo da requisição como JSON
const multerConfig = multer();

// Especificar a URL permitida para CORS
const corsOptions = {
  // origin: "http://localhost:3000", // Remova a barra no final da URL
  origin: "*",
};

// Habilitar o CORS com as opções específicas
router.use(cors(corsOptions));

// Interface para representar os dados do item Excel
interface ExcelItem {
  code: string;
  description: string;
  quantity: number;
  price: number;
  total_price: number;
}

// Rota para editar um item
router.put("/api/editar/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { description, quantity, price } = req.body;
  
    try {
      // Atualizar o item na base de dados
      const updatedItem = await prisma.excel_items.update({
        where: {
          id,
        },
        data: {
          description,
          quantity,
          price: parseFloat(price),
        },
      });
  
      // Retornar o item atualizado
      return res.json(updatedItem);
    } catch (error) {
      console.error("Erro ao editar o item:", error);
      return res.status(500).json({ error: "Erro ao editar o item" });
    } finally {
      await prisma.$disconnect();
    }
  });
  

// Rota para deletar um item
router.delete("/api/deletar/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    // Encontrar o item na base de dados
    const item = await prisma.excel_items.findUnique({
      where: {
        id,
      },
    });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Deletar o item
    await prisma.excel_items.delete({
      where: {
        id,
      },
    });

    // Retornar uma resposta de sucesso
    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ error: "Error deleting item" });
  } finally {
    await prisma.$disconnect();
  }
});

router.get("/api/tabela", async (request, response) => {
  try {
    const offset = request.query.offset as string | undefined;
    const limit = request.query.limit as string | undefined;

    const parsedOffset = parseInt(offset!, 10); // Use o operador de nulabilidade para garantir que o valor não seja nulo
    const parsedLimit = parseInt(limit!, 10); // Use o operador de nulabilidade para garantir que o valor não seja nulo

    // Verifique se offset e limit são valores válidos antes de usar
    if (!Number.isNaN(parsedOffset) && !Number.isNaN(parsedLimit)) {
      // Buscar os dados da tabela usando o Prisma com os parâmetros de offset e limit
      const data = await prisma.excel_items.findMany({
        skip: parsedOffset, // Pule os primeiros "offset" registros
        take: parsedLimit, // Retorne no máximo "limit" registros
      });

      // Retornar os dados como resposta
      return response.json(data);
    } else {
      throw new Error("Offset ou limit inválido");
    }
  } catch (error) {
    console.error("Erro ao buscar os dados da tabela:", error);
    return response.status(500).send("Erro ao buscar os dados da tabela.");
  } finally {
    await prisma.$disconnect();
  }
});

router.post(
    "/api/upload",
    multerConfig.single("file"),
    async (request: Request, response: Response) => {
      const { file } = request;
      if (!file) {
        return response.status(400).send("Nenhum arquivo foi fornecido.");
      }
  
      const { buffer } = file;
      if (!buffer) {
        return response.status(400).send("O arquivo não contém dados.");
      }
  
      const readableFile = new Readable();
      readableFile.push(buffer);
      readableFile.push(null);
  
      const excelItems: ExcelItem[] = []; // Array para armazenar os itens Excel
  
      // Processar as linhas do arquivo usando for-await-of
      try {
        for await (const line of readlineGenerator(readableFile)) {
          const uploadLineSplit = line.split(";");
          const code = uploadLineSplit[0];
          const description = uploadLineSplit[1];
          const quantity = Number(uploadLineSplit[2]);
          const price = Number(uploadLineSplit[3]);
          const total_price = Number(uploadLineSplit[4]);
  
          excelItems.push({ code, description, quantity, price, total_price });
        }
      } catch (error) {
        console.error("Erro ao processar as linhas do arquivo:", error);
        return response
          .status(500)
          .send("Erro ao processar as linhas do arquivo.");
      }
  
      // Salvar ou atualizar os itens Excel no banco de dados usando o Prisma Client
      try {
        for (const item of excelItems) {
          const existingItem = await prisma.excel_items.findUnique({
            where: {
              code: item.code,
            },
          });
  
          if (existingItem) {
            // Atualizar o item existente com os novos dados
            await prisma.excel_items.update({
              where: {
                code: item.code,
              },
              data: {
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                total_price: item.total_price,
              },
            });
          } else {
            // Criar um novo item se não existir
            await prisma.excel_items.create({
              data: item,
            });
          }
        }
        return response.send("Upload concluído com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar os itens Excel no banco de dados:", error);
        return response
          .status(500)
          .send("Erro ao salvar os itens Excel no banco de dados.");
      } finally {
        await prisma.$disconnect();
      }
    }
  );  

// Função auxiliar para gerar as linhas do arquivo a partir da segunda linha como um iterador assíncrono
async function* readlineGenerator(readable: Readable) {
  const readlineInterface = readline.createInterface({
    input: readable,
  });

  let lineNumber = 0;
  for await (const line of readlineInterface) {
    if (lineNumber > 0) {
      yield line;
    }
    lineNumber++;
  }
}

export { router };
