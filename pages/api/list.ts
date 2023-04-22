import { NextApiRequest, NextApiResponse } from "next";
import { Data } from "@/lib/data";
import { ENV } from "@/lib/env";
import fetcher from "@/lib/fetcher";
import { normalizeData } from "@/lib/normalizeData";

async function getData() {
  return fetcher<Data>("https://dev.test.sega.co.uk/api/list", {
    headers: {
      "x-secret-api-key": ENV.X_SECRET_API_KEY,
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = normalizeData(await getData());

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Response) {
      const text = await error.text();

      res.status(error.status).json({ description: text });
    } else {
      res.status(500).json({ description: "Something went wrong." });
    }
  }
}
